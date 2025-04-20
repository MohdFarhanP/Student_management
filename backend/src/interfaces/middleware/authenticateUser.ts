import { NextFunction, Request, Response } from "express";
import { AuthService } from "../../application/services/authService";
import { ITokenService } from "../../domain/interface/ITokenService";
import HttpStatus from "../../utils/httpStatus";


const tokenService: ITokenService = new AuthService();

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
    const decoded = tokenService.verifyToken(token) as {
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