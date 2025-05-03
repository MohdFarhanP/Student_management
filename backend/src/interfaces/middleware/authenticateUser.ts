import { NextFunction, Request, Response } from "express";
import { AuthService } from "../../application/services/AuthService";
import { IAuthService } from "../../domain/interface/IAuthService";
import HttpStatus from "../../utils/httpStatus";


const authService: IAuthService = new AuthService();

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;
  if (!token) {
    res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: 'No token provided' });
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
      role: decoded.role
    };
    
    next();
  } catch (error) {
    res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: 'Invalid token' });
      return;
  }
};