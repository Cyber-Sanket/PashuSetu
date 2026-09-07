import { Router, Response } from 'express';
import { prisma } from '../database/prisma';
import { authenticateJwt, AuthenticatedRequest } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.guard';
import { NotificationService } from '../services/notification.service';

const router = Router();

// 1. Veterinarian Dashboard Caseload Stats
router.get('/vet/stats', authenticateJwt, requireRole('VETERINARIAN'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const totalCases = await prisma.diseaseCase.count();
    const newCases = await prisma.diseaseCase.count({ where: { status: 'UNDER_REVIEW' } });
    const pendingCases = await prisma.diseaseCase.count({ where: { status: { in: ['ASSIGNED', 'DIAGNOSED', 'TREATMENT_STARTED'] } } });
    const resolvedCases = await prisma.diseaseCase.count({ where: { status: 'RESOLVED' } });

    // High risk and critical cases
    const highRiskCases = await prisma.symptomReport.count({ where: { riskLevel: 'HIGH' } });
    const criticalCases = await prisma.symptomReport.count({ where: { riskLevel: 'CRITICAL' } });

    // Pending lab samples
    const pendingSamples = await prisma.labSample.count({ where: { status: { not: 'COMPLETED' } } });

    res.json({
      totalCases,
      newCases,
      pendingCases,
      highRiskCases,
      criticalCases,
      resolvedCases,
      pendingSamples,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. List Cases (with triage filtering)
router.get('/', authenticateJwt, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { riskLevel, status, district, disease } = req.query;

    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = String(status);
    }

    if (disease && disease !== 'ALL') {
      where.OR = [
        { suspectedDisease: { contains: String(disease) } },
        { confirmedDisease: { contains: String(disease) } },
      ];
    }

    if (riskLevel && riskLevel !== 'ALL') {
      where.report = { riskLevel: String(riskLevel) };
    }

    if (district && district !== 'ALL') {
      where.report = { ...(where.report || {}), district: String(district) };
    }

    const cases = await prisma.diseaseCase.findMany({
      where,
      include: {
        report: {
          include: {
            riskAssessment: true,
          },
        },
        vet: {
          include: {
            user: { select: { name: true, mobile: true, email: true } },
          },
        },
        treatments: true,
        labSamples: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Also fetch the associated animal for each case
    const enrichedCases = await Promise.all(
      cases.map(async (c) => {
        const animal = await prisma.animal.findUnique({
          where: { id: c.animalId },
          include: {
            farmer: {
              include: { user: { select: { name: true, mobile: true, email: true } } },
            },
          },
        });
        return { ...c, animal };
      })
    );

    res.json(enrichedCases);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Case Details
router.get('/:id', authenticateJwt, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const diseaseCase = await prisma.diseaseCase.findUnique({
      where: { id },
      include: {
        report: {
          include: {
            riskAssessment: true,
          },
        },
        vet: {
          include: {
            user: { select: { name: true, mobile: true, email: true } },
          },
        },
        treatments: {
          include: {
            vet: { include: { user: { select: { name: true } } } },
          },
          orderBy: { createdAt: 'desc' },
        },
        labSamples: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!diseaseCase) {
      res.status(404).json({ error: 'Case not found.' });
      return;
    }

    // Fetch animal with previous medical history
    const animal = await prisma.animal.findUnique({
      where: { id: diseaseCase.animalId },
      include: {
        farmer: {
          include: { user: { select: { name: true, mobile: true, email: true, language: true } } },
        },
        vaccinations: { orderBy: { administeredDate: 'desc' } },
        symptomReports: {
          where: { id: { not: diseaseCase.reportId } },
          include: { riskAssessment: true },
          take: 5,
        },
      },
    });

    res.json({ ...diseaseCase, animal });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Accept / Assign Case to Current Veterinarian
router.post('/:id/accept', authenticateJwt, requireRole('VETERINARIAN'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const vetProfileId = req.user?.vetProfileId;

    if (!vetProfileId) {
      res.status(400).json({ error: 'Veterinarian profile required.' });
      return;
    }

    const updated = await prisma.diseaseCase.update({
      where: { id },
      data: {
        vetId: vetProfileId,
        status: 'ASSIGNED',
      },
      include: { report: true },
    });

    // Update report status
    await prisma.symptomReport.update({
      where: { id: updated.reportId },
      data: { status: 'VET_ASSIGNED' },
    });

    // Notify farmer
    await NotificationService.notifyUser(
      updated.report.farmerId,
      '👨‍⚕️ Veterinarian Assigned to Your Case',
      `Dr. ${req.user!.name} has accepted your health report and is reviewing the case.`,
      'CASE_UPDATE',
      `/farmer/reports`
    );

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Submit Official Veterinary Clinical Diagnosis
router.post('/:id/diagnosis', authenticateJwt, requireRole('VETERINARIAN'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const {
      suspectedDisease,
      confirmedDisease,
      clinicalDiagnosis,
      clinicalSeverity,
      clinicalNotes,
      recommendedAction,
    } = req.body;

    if (!clinicalDiagnosis) {
      res.status(400).json({ error: 'Clinical diagnosis is required.' });
      return;
    }

    const updated = await prisma.diseaseCase.update({
      where: { id },
      data: {
        suspectedDisease,
        confirmedDisease,
        clinicalDiagnosis,
        clinicalSeverity: clinicalSeverity || 'Moderate',
        clinicalNotes,
        recommendedAction,
        status: 'DIAGNOSED',
        vetId: req.user?.vetProfileId || undefined,
      },
      include: { report: true },
    });

    // Update report status
    await prisma.symptomReport.update({
      where: { id: updated.reportId },
      data: { status: 'DIAGNOSIS_AVAILABLE' },
    });

    // Notify farmer
    await NotificationService.notifyUser(
      updated.report.farmerId,
      '📋 Veterinary Diagnosis Available',
      `Dr. ${req.user!.name} has completed clinical evaluation: ${clinicalDiagnosis}. Review recommended management steps.`,
      'CASE_UPDATE',
      `/farmer/reports`
    );

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Escalate High-Risk Case to Government Authorities
router.post('/:id/escalate', authenticateJwt, requireRole('VETERINARIAN'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { reason } = req.body;

    const updated = await prisma.diseaseCase.update({
      where: { id },
      data: {
        escalatedToGovt: true,
        status: 'ESCALATED',
        clinicalNotes: reason ? `[ESCALATED] ${reason}` : undefined,
      },
      include: { report: true },
    });

    // Notify Government
    await NotificationService.notifyRole(
      'GOVERNMENT',
      '🚨 CASE ESCALATED BY VETERINARIAN',
      `Dr. ${req.user!.name} has escalated Case ${updated.caseCode} in ${updated.report.village}, ${updated.report.district}. High-risk containment review needed.`,
      'ALERT',
      '/government/outbreaks'
    );

    res.json({ message: 'Case successfully escalated to District Health Authority.', case: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Mark Case as Resolved
router.post('/:id/resolve', authenticateJwt, requireRole('VETERINARIAN'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { resolutionNotes } = req.body;

    const updated = await prisma.diseaseCase.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        clinicalNotes: resolutionNotes ? `[RESOLVED] ${resolutionNotes}` : undefined,
      },
      include: { report: true },
    });

    // Update animal status to HEALTHY
    await prisma.animal.update({
      where: { id: updated.animalId },
      data: { healthStatus: 'HEALTHY' },
    });

    // Update report status
    await prisma.symptomReport.update({
      where: { id: updated.reportId },
      data: { status: 'RESOLVED' },
    });

    // Notify farmer
    await NotificationService.notifyUser(
      updated.report.farmerId,
      '✅ Case Resolved — Animal Recovered',
      `Dr. ${req.user!.name} has marked your case as resolved. Keep continuing routine care.`,
      'CASE_UPDATE',
      `/farmer/reports`
    );

    res.json({ message: 'Case successfully resolved.', case: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
