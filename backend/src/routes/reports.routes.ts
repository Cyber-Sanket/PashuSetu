import { Router, Response } from 'express';
import { prisma } from '../database/prisma';
import { authenticateJwt, AuthenticatedRequest } from '../middleware/auth.middleware';
import { RiskEngineService } from '../services/risk-engine.service';
import { OutbreakDetectorService } from '../services/outbreak-detector.service';
import { NotificationService } from '../services/notification.service';

const router = Router();

// 1. Submit Symptom Report with Automatic Rule-Based Risk Engine & Outbreak Cluster Check
router.post('/', authenticateJwt, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      animalId,
      symptoms, // array of strings
      durationDays,
      severity,
      temperatureF,
      appetiteStatus,
      milkProductionChange,
      additionalDescription,
      photoUrl,
      latitude,
      longitude,
    } = req.body;

    if (!animalId || !symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      res.status(400).json({ error: 'Animal selection and at least one symptom are required.' });
      return;
    }

    const animal = await prisma.animal.findUnique({
      where: { id: animalId },
      include: { farmer: true },
    });

    if (!animal) {
      res.status(404).json({ error: 'Animal not found.' });
      return;
    }

    // 1. Run Rule-Based Epidemiological Risk Engine
    const assessmentResult = RiskEngineService.assess({
      species: animal.species,
      symptoms,
      durationDays: parseInt(durationDays || '1', 10),
      severity: severity || 'Moderate',
      temperatureF: temperatureF ? parseFloat(temperatureF) : null,
      appetiteStatus: appetiteStatus || 'Reduced',
      milkProductionChange: milkProductionChange || 'None',
    });

    // 2. Generate Report Code (e.g. REP-2026-0042)
    const reportCount = await prisma.symptomReport.count();
    const reportCode = `REP-${new Date().getFullYear()}-${String(reportCount + 1).padStart(4, '0')}`;

    // 3. Create Symptom Report
    const symptomReport = await prisma.symptomReport.create({
      data: {
        reportCode,
        animalId: animal.id,
        farmerId: req.user!.id,
        symptoms: JSON.stringify(symptoms),
        durationDays: parseInt(durationDays || '1', 10),
        severity: severity || 'Moderate',
        temperatureF: temperatureF ? parseFloat(temperatureF) : null,
        appetiteStatus: appetiteStatus || 'Reduced',
        milkProductionChange: milkProductionChange || 'None',
        additionalDescription,
        photoUrl,
        latitude: latitude ? parseFloat(latitude) : animal.latitude,
        longitude: longitude ? parseFloat(longitude) : animal.longitude,
        village: animal.village,
        block: animal.block,
        district: animal.district,
        riskScore: assessmentResult.riskScore,
        riskLevel: assessmentResult.riskLevel,
        status: 'SUBMITTED',
      },
    });

    // 4. Save Risk Assessment Record
    const riskAssessment = await prisma.riskAssessment.create({
      data: {
        reportId: symptomReport.id,
        riskScore: assessmentResult.riskScore,
        riskLevel: assessmentResult.riskLevel,
        possibleCategory: assessmentResult.possibleCategory,
        riskFactors: JSON.stringify(assessmentResult.riskFactors),
        recommendedAction: assessmentResult.recommendedAction,
        isDecisionSupportOnly: true,
        engineVersion: 'v1.0-rule-based',
      },
    });

    // 5. Automatically create a DiseaseCase record for Veterinarian triage
    const caseCount = await prisma.diseaseCase.count();
    const caseCode = `CASE-MH-${new Date().getFullYear()}-${String(caseCount + 1).padStart(4, '0')}`;

    const diseaseCase = await prisma.diseaseCase.create({
      data: {
        caseCode,
        reportId: symptomReport.id,
        animalId: animal.id,
        suspectedDisease: assessmentResult.possibleCategory,
        clinicalSeverity: assessmentResult.riskLevel === 'CRITICAL' ? 'Critical' : assessmentResult.riskLevel === 'HIGH' ? 'Severe' : 'Moderate',
        status: 'UNDER_REVIEW',
      },
    });

    // 6. Update Animal Health Status
    await prisma.animal.update({
      where: { id: animal.id },
      data: {
        healthStatus: assessmentResult.riskLevel === 'CRITICAL' || assessmentResult.riskLevel === 'HIGH' ? 'SICK' : 'OBSERVATION',
      },
    });

    // 7. Evaluate Geo-Temporal Outbreak Clustering
    await OutbreakDetectorService.evaluateCluster({
      village: animal.village,
      block: animal.block,
      district: animal.district,
      latitude: symptomReport.latitude,
      longitude: symptomReport.longitude,
      suspectedDisease: assessmentResult.possibleCategory,
    });

    // 8. Trigger Notifications if High or Critical
    if (assessmentResult.riskLevel === 'CRITICAL' || assessmentResult.riskLevel === 'HIGH') {
      await NotificationService.notifyUser(
        req.user!.id,
        `⚠️ ${assessmentResult.riskLevel} HEALTH RISK: ${animal.name || animal.animalCode}`,
        `Your animal has been categorized as ${assessmentResult.riskLevel} risk (${assessmentResult.possibleCategory}). Urgent veterinary isolation recommended.`,
        'ALERT',
        `/farmer/reports`
      );

      // Alert Veterinarians in the district
      await NotificationService.notifyRole(
        'VETERINARIAN',
        `🚨 High Risk Case Alert: ${animal.animalCode} (${animal.village}, ${animal.district})`,
        `New ${assessmentResult.riskLevel} risk symptom report filed for ${animal.species}. Possible: ${assessmentResult.possibleCategory}. Immediate review needed.`,
        'ALERT',
        `/veterinarian/cases/${diseaseCase.id}`
      );
    }

    res.status(201).json({
      report: symptomReport,
      riskAssessment,
      diseaseCase,
      assessmentResult,
    });
  } catch (error: any) {
    console.error('Symptom report error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 2. Submit Mortality / Animal Death Report
router.post('/death', authenticateJwt, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      animalId,
      dateOfDeath,
      symptomsBeforeDeath,
      suspectedCause,
      otherSickCount,
      description,
      photoUrl,
    } = req.body;

    if (!animalId || !symptomsBeforeDeath) {
      res.status(400).json({ error: 'Animal ID and symptoms prior to death are required.' });
      return;
    }

    const animal = await prisma.animal.findUnique({ where: { id: animalId } });
    if (!animal) {
      res.status(404).json({ error: 'Animal not found.' });
      return;
    }

    const deathCountTotal = await prisma.mortalityReport.count();
    const reportCode = `DTH-MH-${new Date().getFullYear()}-${String(deathCountTotal + 1).padStart(4, '0')}`;

    const mortality = await prisma.mortalityReport.create({
      data: {
        reportCode,
        animalId: animal.id,
        farmerId: req.user!.id,
        dateOfDeath: dateOfDeath ? new Date(dateOfDeath) : new Date(),
        symptomsBeforeDeath,
        suspectedCause: suspectedCause || 'Sudden Mortality',
        otherSickCount: parseInt(otherSickCount || '0', 10),
        description,
        photoUrl,
        village: animal.village,
        block: animal.block,
        district: animal.district,
        latitude: animal.latitude,
        longitude: animal.longitude,
      },
    });

    // Mark animal deceased
    await prisma.animal.update({
      where: { id: animal.id },
      data: { healthStatus: 'DECEASED' },
    });

    // Evaluate Outbreak Cluster (Mortality clusters strongly trigger Outbreak detection!)
    await OutbreakDetectorService.evaluateCluster({
      village: animal.village,
      block: animal.block,
      district: animal.district,
      latitude: animal.latitude,
      longitude: animal.longitude,
      suspectedDisease: suspectedCause || 'Livestock Mortality',
    });

    // Send high priority notification to Govt & Vets
    await NotificationService.notifyRole(
      'GOVERNMENT',
      `⚠️ MORTALITY REPORTED: ${animal.village}, ${animal.district}`,
      `Animal death recorded for ${animal.animalCode} (${animal.species}). ${otherSickCount || 0} other animals reportedly sick.`,
      'ALERT',
      '/government/outbreaks'
    );

    res.status(201).json(mortality);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. List Reports
router.get('/', authenticateJwt, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { status, riskLevel, district } = req.query;

    const where: any = {};

    // Farmers only see their own reports
    if (req.user?.role === 'FARMER') {
      where.farmerId = req.user.id;
    }

    if (status && status !== 'ALL') {
      where.status = String(status);
    }

    if (riskLevel && riskLevel !== 'ALL') {
      where.riskLevel = String(riskLevel);
    }

    if (district && district !== 'ALL') {
      where.district = String(district);
    }

    const reports = await prisma.symptomReport.findMany({
      where,
      include: {
        animal: true,
        riskAssessment: true,
        diseaseCase: {
          include: {
            vet: {
              include: {
                user: { select: { name: true, mobile: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(reports);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3b. Farmer's Reports Endpoint
router.get('/farmer', authenticateJwt, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const reports = await prisma.symptomReport.findMany({
      where: { farmerId: req.user!.id },
      include: {
        animal: true,
        riskAssessment: true,
        diseaseCase: {
          include: {
            vet: {
              include: {
                user: { select: { name: true, mobile: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(reports);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Single Report Details
router.get('/:id', authenticateJwt, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const report = await prisma.symptomReport.findUnique({
      where: { id },
      include: {
        animal: {
          include: {
            farmer: {
              include: { user: { select: { name: true, mobile: true, email: true } } },
            },
          },
        },
        riskAssessment: true,
        diseaseCase: {
          include: {
            vet: {
              include: { user: { select: { name: true, mobile: true } } },
            },
            treatments: true,
            labSamples: true,
          },
        },
      },
    });

    if (!report) {
      res.status(404).json({ error: 'Report not found.' });
      return;
    }

    res.json(report);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
