import { Request, Response, NextFunction } from 'express';
import { ITokenService } from '../../domain/interface/ITokenService.js';
import { AuthService } from '../../application/services/authService.js';
import HttpStatus from '../../utils/httpStatus.js';

interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string; role: string };
}

const tokenService: ITokenService = new AuthService();

export const authenticateUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;
  if (!token) {
    res.status(HttpStatus.UNAUTHORIZED).json({ message: 'No token provided' });
    return;
  }

  try {
    const decoded = tokenService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid token' });
    return;
  }
};
