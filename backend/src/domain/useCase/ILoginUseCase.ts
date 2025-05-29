import { Role } from '../types/enums';
import { ITokenResponse } from '../types/interfaces';

export interface ILoginUseCase {
  execute(email: string, password: string, role: Role): Promise<ITokenResponse>;
}
