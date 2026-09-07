import { Router, Request, Response } from 'express';
import { prisma } from '../database/prisma';

const router = Router();

// Get Nearby Veterinary Facilities
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { district } = req.query;

    const where: any = {};
    if (district && district !== 'ALL') {
      where.district = String(district);
    }

    const facilities = await prisma.vetServiceLocation.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    res.json(facilities);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
