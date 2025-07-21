import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IAuthService } from '../../application/services/IAuthService';
import { Role } from '../../domain/types/enums';
import logger from '../../logger';

export class AuthService implements IAuthService {
  private jwtSecret = process.env.JWT_SECRET;
  private refreshSecret = process.env.JWT_REFRESH_SECRET;

  async comparePasswords(
    plainText: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainText, hashedPassword);
  }

  async hashPassword(password: string): Promise<string> {
    try {
      const saltRounds = 10;
      return bcrypt.hash(password, saltRounds);
    } catch (error) {
      throw new Error('Failed to hash password');
    }
  }

  generateToken(payload: { id: string; email: string; role: Role }): string {
    return jwt.sign(payload, this.jwtSecret, { expiresIn: '15m' });
  }

  generateRefreshToken(payload: { email: string; role: Role }): string {
    return jwt.sign(payload, this.refreshSecret, { expiresIn: '7d' });
  }

  verifyRefreshToken(token: string): { email: string; role: Role } {
    try {
      const obj = jwt.verify(token, this.refreshSecret) as {
        email: string;
        role: Role;
      };
      return obj;
    } catch (error) {
      logger.error('error on verify Refresh token ', error);
      throw error;
    }
  }
  verifyToken(token: string): { id: string; email: string; role: Role } {
    try {
      return jwt.verify(token, this.jwtSecret) as {
        id: string;
        email: string;
        role: Role;
      };
    } catch (error) {
      logger.error('Error verifying token in AuthService:', error);
      throw error;
    }
  }
}
