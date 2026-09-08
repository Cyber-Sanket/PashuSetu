import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../database/prisma';
import { ENV } from '../config/env';
import { authenticateJwt, AuthenticatedRequest } from '../middleware/auth.middleware';

const router = Router();

// 1. Farmer Registration
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      mobile,
      email,
      password,
      village,
      block,
      district,
      state = 'Maharashtra',
      pincode,
      preferredLanguage = 'en',
    } = req.body;

    if (!name || !email || !password || !village || !district) {
      res.status(400).json({ error: 'Name, email, password, village, and district are required.' });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      res.status(400).json({ error: 'An account with this email already exists.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        mobile,
        passwordHash,
        role: 'FARMER',
        language: preferredLanguage,
        farmerProfile: {
          create: {
            village,
            block: block || 'District Headquarters',
            district,
            state,
            pincode,
          },
        },
      },
      include: {
        farmerProfile: true,
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      ENV.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Farmer account created successfully.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        language: user.language,
        farmerProfile: user.farmerProfile,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register account: ' + error.message });
  }
});

// 2. Universal / Role-based Login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { password, role } = req.body;
    const identifier = req.body.identifier || req.body.email || req.body.mobile;
    // identifier can be email, mobile, vetId, or officialId

    if (!identifier || !password) {
      res.status(400).json({ error: 'Username/Email/ID and password are required.' });
      return;
    }

    const cleanIdentifier = identifier.trim().toLowerCase();

    // Look up user by email or mobile, or check vetProfile.vetId or govtProfile.officialId
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanIdentifier },
          { mobile: cleanIdentifier },
          { vetProfile: { vetId: { equals: identifier.trim() } } },
          { govtProfile: { officialId: { equals: identifier.trim() } } },
        ],
      },
      include: {
        farmerProfile: true,
        vetProfile: true,
        govtProfile: true,
      },
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials. Please verify your email/ID and password.' });
      return;
    }

    // Role check if explicitly requested
    if (role && user.role !== role) {
      res.status(403).json({
        error: `Account found, but role '${user.role}' does not match requested portal role '${role}'. Please use the correct login tab.`,
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid credentials. Password incorrect.' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      ENV.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        language: user.language,
        farmerProfile: user.farmerProfile,
        vetProfile: user.vetProfile,
        govtProfile: user.govtProfile,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Authentication failed: ' + error.message });
  }
});

// 3. Current User Profile
router.get('/me', authenticateJwt, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        farmerProfile: true,
        vetProfile: true,
        govtProfile: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      language: user.language,
      farmerProfile: user.farmerProfile,
      vetProfile: user.vetProfile,
      govtProfile: user.govtProfile,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch user profile: ' + error.message });
  }
});

// 4. Update Language Preference
router.patch('/language', authenticateJwt, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { language } = req.body;
    if (!['en', 'mr', 'hi'].includes(language)) {
      res.status(400).json({ error: 'Invalid language. Supported: en, mr, hi.' });
      return;
    }

    await prisma.user.update({
      where: { id: req.user!.id },
      data: { language },
    });

    res.json({ success: true, language });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
