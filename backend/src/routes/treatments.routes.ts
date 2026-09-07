import { Router, Response } from 'express';
import { prisma } from '../database/prisma';
import { authenticateJwt, AuthenticatedRequest } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.guard';
import { NotificationService } from '../services/notification.service';

const router = Router();

// 1. Prescribe Treatment
router.post('/', authenticateJwt, requireRole('VETERINARIAN'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const vetProfileId = req.user?.vetProfileId;
    if (!vetProfileId) {
      res.status(400).json({ error: 'Veterinarian profile required.' });
      return;
    }

    const {
      caseId,
      animalId,
      diagnosis,
      medicines, // array of { name, dosage, frequency, duration }
      instructions,
      startDate,
      endDate,
      followUpDate,
      notes,
    } = req.body;

    if (!caseId || !animalId || !diagnosis || !medicines) {
      res.status(400).json({ error: 'Case ID, Animal ID, diagnosis, and medicine details are required.' });
      return;
    }

    const treatment = await prisma.treatment.create({
      data: {
        caseId,
        animalId,
        vetId: vetProfileId,
        diagnosis,
        medicines: JSON.stringify(medicines),
        instructions,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        followUpDate: followUpDate ? new Date(followUpDate) : null,
        notes,
      },
      include: {
        diseaseCase: { include: { report: true } },
      },
    });

    // Update case status to TREATMENT_STARTED
    await prisma.diseaseCase.update({
      where: { id: caseId },
      data: { status: 'TREATMENT_STARTED' },
    });

    // Update report status
    await prisma.symptomReport.update({
      where: { id: treatment.diseaseCase.reportId },
      data: { status: 'TREATMENT_STARTED' },
    });

    // Notify farmer
    await NotificationService.notifyUser(
      treatment.diseaseCase.report.farmerId,
      '💊 New Treatment Prescribed',
      `Dr. ${req.user!.name} has issued an e-prescription for your animal. View medicines, dosage and instructions now.`,
      'CASE_UPDATE',
      `/farmer/treatments`
    );

    res.status(201).json(treatment);
  } catch (error: any) {
    console.error('Treatment error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 2. Get Treatments
router.get('/', authenticateJwt, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { animalId } = req.query;

    const where: any = {};

    if (animalId) {
      where.animalId = String(animalId);
    }

    if (req.user?.role === 'FARMER' && req.user.farmerProfileId) {
      where.animal = { farmerId: req.user.farmerProfileId };
    }

    const treatments = await prisma.treatment.findMany({
      where,
      include: {
        animal: true,
        vet: {
          include: {
            user: { select: { name: true, mobile: true, email: true } },
          },
        },
        diseaseCase: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(treatments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
