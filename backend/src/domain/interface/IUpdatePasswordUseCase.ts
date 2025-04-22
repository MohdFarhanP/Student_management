import { Role } from '../types/enums';
import { IUser } from '../types/interfaces';

export interface IUpdatePasswordUseCase {
  execute(email: string, password: string, role: Role): Promise<IUser>;
}