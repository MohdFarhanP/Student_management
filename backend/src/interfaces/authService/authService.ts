import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export interface AuthPayload {
  id: string;
  email: string;
  role: string;
}

export class AuthService {
  static async hashPassword(plainText: string): Promise<string> {
    const saltRounds = 10;

    return bcrypt.hash(plainText, saltRounds);
  }

  static async comparePasswords(
    plainText: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainText, hashedPassword);
  }

  static generateToken(payload: AuthPayload): string {
    const jwtSecret = process.env.JWT_SECRET || 'secret_key';
    return jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
  }

  static verifyToken(token: string): AuthPayload {
    const jwtSecret = process.env.JWT_SECRET || 'secret_key';
    return jwt.verify(token, jwtSecret) as AuthPayload;
  }
}
