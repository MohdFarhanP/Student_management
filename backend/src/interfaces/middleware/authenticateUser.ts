import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import HttpStatus from '../../utils/httpStatus.js';

interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string } | JwtPayload;
}

export const authenticateUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;
  if (!token) {
    res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      email: string;
      role: string;
    };
    req.user = decoded;
    next();
  } catch (err) {
    res
      .status(HttpStatus.FORBIDDEN)
      .json({ message: `${err}` || 'Invalid or expired token' });
  }
};
