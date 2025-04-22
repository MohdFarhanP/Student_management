import { ITokenResponse } from '../types/interfaces';

export interface IRefreshTokenUseCase {
  execute(refreshToken: string): Promise<ITokenResponse>;
}