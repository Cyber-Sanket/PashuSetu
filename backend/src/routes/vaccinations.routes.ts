import { Router, Response } from 'express';
import { prisma } from '../database/prisma';
import { authenticateJwt, AuthenticatedRequest } from '../middleware/auth.middleware';

const router = Router();

// 1. Record Vaccination
router.post('/', authenticateJwt, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      animalId,
      vaccineName,
      batchNumber,
      doseNumber,
      administeredDate,
      nextDueDate,
      notes,
    } = req.body;

    if (!animalId || !vaccineName || !administeredDate) {
      res.status(400).json({ error: 'Animal ID, Vaccine Name, and Administered Date are required.' });
      return;
    }

    const vaccination = await prisma.vaccination.create({
      data: {
        animalId,
        vaccineName,
        batchNumber,
        doseNumber: parseInt(doseNumber || '1', 10),
        administeredDate: new Date(administeredDate),
        nextDueDate: nextDueDate ? new Date(nextDueDate) : null,
        administeredBy: req.user?.name || 'Veterinary Officer',
        status: 'COMPLETED',
        notes,
      },
      include: {
        animal: true,
      },
    });

    res.status(201).json(vaccination);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Get Vaccinations
router.get('/', authenticateJwt, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { animalId, status } = req.query;

    const where: any = {};

    if (animalId) {
      where.animalId = String(animalId);
    }

    if (status && status !== 'ALL') {
      where.status = String(status);
    }

    if (req.user?.role === 'FARMER' && req.user.farmerProfileId) {
      where.animal = { farmerId: req.user.farmerProfileId };
    }

    const vaccinations = await prisma.vaccination.findMany({
      where,
      include: {
        animal: {
          include: {
            farmer: { include: { user: { select: { name: true, mobile: true } } } },
          },
        },
      },
      orderBy: { administeredDate: 'desc' },
    });

    res.json(vaccinations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
