export interface ITokenService {
  comparePasswords(plainText: string, hashedPassword: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>;
  generateToken(payload: { id: string; email: string; role: string }): string;
  generateRefreshToken(payload: { email: string; role: string }): string;
  verifyRefreshToken(token: string): { email: string; role: string };
  verifyToken(token: string): { id: string; email: string; role: string };
}
