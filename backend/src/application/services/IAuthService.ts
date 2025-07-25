import { Role } from '../../domain/types/enums';

export interface IAuthService {
  comparePasswords(plainText: string, hashedPassword: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>;
  generateToken(payload: { id: string; email: string; role: Role }): string;
  generateRefreshToken(payload: { email: string; role: Role }): string;
  verifyRefreshToken(token: string): { email: string; role: Role };
  verifyToken(token: string): { id: string; email: string; role: Role };
}
