import { Router, Response } from 'express';
import { prisma } from '../database/prisma';
import { authenticateJwt, AuthenticatedRequest } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.guard';
import { NotificationService } from '../services/notification.service';

const router = Router();

// 1. Request Lab Sample
router.post('/', authenticateJwt, requireRole('VETERINARIAN', 'GOVERNMENT'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      caseId,
      animalId,
      sampleType,
      collectionLocation,
      laboratoryName,
      testType,
    } = req.body;

    if (!caseId || !animalId || !sampleType || !testType) {
      res.status(400).json({ error: 'Case ID, Animal ID, Sample Type, and Test Type are required.' });
      return;
    }

    const sampleCount = await prisma.labSample.count();
    const sampleCode = `SMP-${new Date().getFullYear()}-${String(sampleCount + 1).padStart(4, '0')}`;

    const sample = await prisma.labSample.create({
      data: {
        sampleCode,
        caseId,
        animalId,
        sampleType,
        collectionLocation: collectionLocation || 'Field Sample Point',
        laboratoryName: laboratoryName || 'Disease Investigation Section (DIS), Pune',
        testType,
        status: 'REQUESTED',
      },
      include: {
        diseaseCase: { include: { report: true } },
      },
    });

    // Update report status
    await prisma.symptomReport.update({
      where: { id: sample.diseaseCase.reportId },
      data: { status: 'SAMPLE_REQUESTED' },
    });

    res.status(201).json(sample);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. List Samples
router.get('/', authenticateJwt, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { status, testType } = req.query;

    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = String(status);
    }

    if (testType && testType !== 'ALL') {
      where.testType = String(testType);
    }

    const samples = await prisma.labSample.findMany({
      where,
      include: {
        diseaseCase: {
          include: {
            report: true,
            vet: { include: { user: { select: { name: true } } } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Enrich with animal details
    const enriched = await Promise.all(
      samples.map(async (s) => {
        const animal = await prisma.animal.findUnique({
          where: { id: s.animalId },
          select: { animalCode: true, species: true, breed: true, identificationNumber: true },
        });
        return { ...s, animal };
      })
    );

    res.json(enriched);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Update Sample Lifecycle Status (COLLECTED, DISPATCHED, RECEIVED, TESTING)
router.put('/:id/status', authenticateJwt, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    const updated = await prisma.labSample.update({
      where: { id },
      data: { status },
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Enter Lab Test Result
router.post('/:id/result', authenticateJwt, requireRole('VETERINARIAN', 'GOVERNMENT'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { result, resultNotes } = req.body;

    if (!result) {
      res.status(400).json({ error: 'Test result (POSITIVE, NEGATIVE, INCONCLUSIVE) is required.' });
      return;
    }

    const updated = await prisma.labSample.update({
      where: { id },
      data: {
        result,
        resultNotes,
        resultDate: new Date(),
        status: 'COMPLETED',
      },
      include: {
        diseaseCase: { include: { report: true } },
      },
    });

    // If POSITIVE, notify Government and Vet
    if (result === 'POSITIVE' && updated.diseaseCase) {
      await NotificationService.notifyRole(
        'GOVERNMENT',
        `🔬 LAB CONFIRMATION: Positive Result for ${updated.testType}`,
        `Sample ${updated.sampleCode} tested POSITIVE for ${updated.diseaseCase.suspectedDisease || 'Infectious Disease'}. Location: ${updated.diseaseCase.report.village}, ${updated.diseaseCase.report.district}.`,
        'ALERT',
        '/government/surveillance'
      );
    }

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
