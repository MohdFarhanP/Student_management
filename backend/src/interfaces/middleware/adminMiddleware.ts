import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import HttpStatus from '../../utils/httpStatus.js';

interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

export const authenticateAdmin = (
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    res
      .status(HttpStatus.FORBIDDEN)
      .json({ message: 'Invalid or expired token' });
    return;
  }
};
