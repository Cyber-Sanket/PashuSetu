import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';

export const requireRole = (...allowedRoles: ('FARMER' | 'VETERINARIAN' | 'GOVERNMENT')[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: `Forbidden: User role '${req.user.role}' is not authorized for this resource. Required: ${allowedRoles.join(', ')}`,
      });
      return;
    }

    next();
  };
};
