import { Request, Response, NextFunction } from 'express';
import HttpStatus from '../../utils/httpStatus';

interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user as { role: string };
    if (!user || !roles.includes(user.role)) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: 'Forbidden: Insufficient role' });
    }
    next();
  };
};
