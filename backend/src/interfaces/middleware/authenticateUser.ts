import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../../infrastructure/services/authService';
import { IAuthService } from '../../application/services/IAuthService';
import { HttpStatus } from '../../domain/types/enums';
import logger from '../../logger';

const authService: IAuthService = new AuthService();

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;

  if (!token) {
    res.status(HttpStatus.UNAUTHORIZED).json({ message: 'No token provided' });
    return;
  }

  try {
    const decoded = authService.verifyToken(token) as {
      id: string;
      email: string;
      role: string;
    };

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (error) {
    logger.error('Token verification failed:', error); // Add this
    res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid token' });
    return;
  }
};
