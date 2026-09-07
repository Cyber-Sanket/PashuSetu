import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { prisma } from '../database/prisma';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'FARMER' | 'VETERINARIAN' | 'GOVERNMENT';
  farmerProfileId?: string;
  vetProfileId?: string;
  govtProfileId?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export const authenticateJwt = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Access denied. No token provided.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        farmerProfile: true,
        vetProfile: true,
        govtProfile: true,
      },
    });

    if (!user || user.status !== 'ACTIVE') {
      res.status(401).json({ error: 'User not found or inactive.' });
      return;
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as any,
      farmerProfileId: user.farmerProfile?.id,
      vetProfileId: user.vetProfile?.id,
      govtProfileId: user.govtProfile?.id,
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }
};
