import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ITokenService } from '../../domain/interface/ITokenService';

export class AuthService implements ITokenService {
  private jwtSecret = process.env.JWT_SECRET || 'secret_key';
  private refreshSecret = process.env.JWT_REFRESH_SECRET || 'refresh_secret';

  async comparePasswords(
    plainText: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainText, hashedPassword);
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  generateToken(payload: { id: string; email: string; role: string }): string {
    return jwt.sign(payload, this.jwtSecret, { expiresIn: '15m' });
  }

  generateRefreshToken(payload: { email: string; role: string }): string {
    return jwt.sign(payload, this.refreshSecret, { expiresIn: '7d' });
  }

  verifyRefreshToken(token: string): { email: string; role: string } {
    return jwt.verify(token, this.refreshSecret) as {
      email: string;
      role: string;
    };
  }
  verifyToken(token: string): { id: string; email: string; role: string } {
    return jwt.verify(token, this.jwtSecret) as {
      id: string;
      email: string;
      role: string;
    };
  }
}
