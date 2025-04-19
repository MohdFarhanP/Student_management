import { Request, Response, NextFunction } from 'express';
import { ITokenService } from '../../domain/interface/ITokenService';
import { AuthService } from '../../application/services/authService';
import HttpStatus from '../../utils/httpStatus';

const tokenService: ITokenService = new AuthService();

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
    const decoded = tokenService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid token' });
    return;
  }
};
