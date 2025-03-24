import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export class AuthService {
  static async comparePasswords(
    plainText: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainText, hashedPassword);
  }

  static generateToken(payload: object): string {
    const jwtSecret = (process.env.JWT_SECRET as string) || 'secret_key ';
    return jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
  }
}
