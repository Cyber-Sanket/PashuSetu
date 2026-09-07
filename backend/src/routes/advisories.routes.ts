import { Router, Response } from 'express';
import { prisma } from '../database/prisma';
import { authenticateJwt, AuthenticatedRequest } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.guard';
import { NotificationService } from '../services/notification.service';

const router = Router();

// 1. Get Advisories
router.get('/', authenticateJwt, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { district } = req.query;

    const where: any = { isActive: true };
    if (district && district !== 'ALL') {
      where.OR = [{ targetDistrict: 'ALL' }, { targetDistrict: String(district) }];
    }

    const advisories = await prisma.advisory.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(advisories);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Issue New Multilingual Advisory (Government only)
router.post('/', authenticateJwt, requireRole('GOVERNMENT'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      titleEn,
      titleMr,
      titleHi,
      contentEn,
      contentMr,
      contentHi,
      targetDistrict = 'ALL',
      severity = 'WARNING',
    } = req.body;

    if (!titleEn || !contentEn) {
      res.status(400).json({ error: 'At least English title and content are required.' });
      return;
    }

    const advisory = await prisma.advisory.create({
      data: {
        titleEn,
        titleMr: titleMr || titleEn,
        titleHi: titleHi || titleEn,
        contentEn,
        contentMr: contentMr || contentEn,
        contentHi: contentHi || contentEn,
        targetDistrict,
        severity,
        issuedBy: req.user?.name || 'Department of Animal Husbandry, Maharashtra',
        isActive: true,
      },
    });

    // Notify farmers and vets in targeted district
    await NotificationService.notifyRole(
      'FARMER',
      `📢 ${severity} ADVISORY: ${titleEn}`,
      contentEn.substring(0, 120) + '...',
      'ADVISORY',
      '/farmer/alerts'
    );

    res.status(201).json(advisory);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
