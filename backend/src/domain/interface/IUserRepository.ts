import { Role } from '../types/enums';
import { IUser } from '../types/interfaces';

export interface IUserRepository {
  findByEmailAndRole(email: string, role: Role): Promise<IUser | null>;
  findByRefreshToken(token: string, role: Role): Promise<IUser | null>;
  updatePassword(id: string, password: string): Promise<void>;
  updateRefreshToken(id: string, token: string | null): Promise<void>;
}