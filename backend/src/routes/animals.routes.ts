import { Router, Response } from 'express';
import { prisma } from '../database/prisma';
import { authenticateJwt, AuthenticatedRequest } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.guard';

const router = Router();

// 1. Get Farmer Dashboard Stats
router.get('/farmer/stats', authenticateJwt, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const farmerProfileId = req.user?.farmerProfileId;
    if (!farmerProfileId) {
      res.status(403).json({ error: 'Only farmers can view farmer statistics.' });
      return;
    }

    const totalAnimals = await prisma.animal.count({ where: { farmerId: farmerProfileId } });
    const healthyAnimals = await prisma.animal.count({
      where: { farmerId: farmerProfileId, healthStatus: 'HEALTHY' },
    });
    const sickAnimals = await prisma.animal.count({
      where: { farmerId: farmerProfileId, healthStatus: 'SICK' },
    });
    const underObservation = await prisma.animal.count({
      where: { farmerId: farmerProfileId, healthStatus: 'OBSERVATION' },
    });
    const activeReports = await prisma.symptomReport.count({
      where: {
        farmerId: req.user!.id,
        status: { in: ['SUBMITTED', 'UNDER_REVIEW', 'VET_ASSIGNED', 'SAMPLE_REQUESTED', 'TREATMENT_STARTED'] },
      },
    });

    // Calculate vaccination coverage
    const allFarmerAnimals = await prisma.animal.findMany({
      where: { farmerId: farmerProfileId },
      include: {
        vaccinations: true,
      },
    });

    let vaccinatedCount = 0;
    allFarmerAnimals.forEach((animal) => {
      const hasCompletedVaccine = animal.vaccinations.some((v) => v.status === 'COMPLETED');
      if (hasCompletedVaccine) vaccinatedCount++;
    });

    const vaccinationCoverage = totalAnimals > 0 ? Math.round((vaccinatedCount / totalAnimals) * 100) : 0;

    res.json({
      totalAnimals,
      healthyAnimals,
      sickAnimals,
      underObservation,
      activeReports,
      vaccinationCoverage,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. List Animals (with search & filters)
router.get('/', authenticateJwt, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { species, healthStatus, search } = req.query;

    const where: any = {};

    // If role is FARMER, filter only their own animals
    if (req.user?.role === 'FARMER' && req.user.farmerProfileId) {
      where.farmerId = req.user.farmerProfileId;
    }

    if (species && species !== 'ALL') {
      where.species = String(species);
    }

    if (healthStatus && healthStatus !== 'ALL') {
      where.healthStatus = String(healthStatus);
    }

    if (search) {
      const q = String(search).trim();
      where.OR = [
        { animalCode: { contains: q } },
        { name: { contains: q } },
        { breed: { contains: q } },
        { identificationNumber: { contains: q } },
      ];
    }

    const animals = await prisma.animal.findMany({
      where,
      include: {
        farmer: {
          include: {
            user: {
              select: { name: true, mobile: true, email: true },
            },
          },
        },
        vaccinations: {
          orderBy: { administeredDate: 'desc' },
          take: 3,
        },
        symptomReports: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(animals);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Get Single Animal Profile with complete medical history
router.get('/:id', authenticateJwt, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const animal = await prisma.animal.findUnique({
      where: { id },
      include: {
        farmer: {
          include: {
            user: { select: { id: true, name: true, mobile: true, email: true } },
          },
        },
        symptomReports: {
          include: {
            riskAssessment: true,
            diseaseCase: {
              include: {
                vet: { include: { user: { select: { name: true, mobile: true } } } },
                treatments: true,
                labSamples: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        vaccinations: {
          orderBy: { administeredDate: 'desc' },
        },
        treatments: {
          include: {
            vet: { include: { user: { select: { name: true, mobile: true } } } },
          },
          orderBy: { createdAt: 'desc' },
        },
        mortalityReports: true,
      },
    });

    if (!animal) {
      res.status(404).json({ error: 'Animal not found.' });
      return;
    }

    res.json(animal);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Create New Animal
router.post('/', authenticateJwt, requireRole('FARMER'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const farmerProfileId = req.user?.farmerProfileId;
    if (!farmerProfileId) {
      res.status(400).json({ error: 'Farmer profile is required to register livestock.' });
      return;
    }

    const {
      name,
      species,
      breed,
      gender,
      ageYears,
      weightKg,
      color,
      identificationNumber,
      photoUrl,
    } = req.body;

    if (!species || !breed || !gender || ageYears === undefined) {
      res.status(400).json({ error: 'Species, breed, gender, and age are required.' });
      return;
    }

    const farmer = await prisma.farmerProfile.findUnique({ where: { id: farmerProfileId } });

    // Generate unique Animal Code (e.g. PS-COW-042)
    const animalCount = await prisma.animal.count();
    const speciesPrefix = (species || 'ANM').substring(0, 3).toUpperCase();
    const animalCode = `PS-${speciesPrefix}-${String(animalCount + 1).padStart(4, '0')}`;

    const animal = await prisma.animal.create({
      data: {
        farmerId: farmerProfileId,
        animalCode,
        name: name || `${species} #${animalCount + 1}`,
        species,
        breed,
        gender,
        ageYears: parseFloat(ageYears),
        weightKg: weightKg ? parseFloat(weightKg) : null,
        color,
        identificationNumber: identificationNumber || `TAG-${Math.floor(100000 + Math.random() * 900000)}`,
        photoUrl,
        healthStatus: 'HEALTHY',
        village: farmer?.village || 'Unknown Village',
        block: farmer?.block || 'Unknown Block',
        district: farmer?.district || 'Pune',
      },
    });

    res.status(201).json(animal);
  } catch (error: any) {
    console.error('Add animal error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 5. Update Animal
router.put('/:id', authenticateJwt, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { name, breed, ageYears, weightKg, color, healthStatus, identificationNumber, photoUrl } = req.body;

    const updated = await prisma.animal.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(breed && { breed }),
        ...(ageYears !== undefined && { ageYears: parseFloat(ageYears) }),
        ...(weightKg !== undefined && { weightKg: parseFloat(weightKg) }),
        ...(color && { color }),
        ...(healthStatus && { healthStatus }),
        ...(identificationNumber && { identificationNumber }),
        ...(photoUrl && { photoUrl }),
      },
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Delete Animal
router.delete('/:id', authenticateJwt, requireRole('FARMER'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    await prisma.animal.delete({ where: { id } });
    res.json({ message: 'Animal removed successfully.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
