import { ITokenService } from '../../../domain/interface/ITokenService';
import { IUserRepository } from '../../../domain/interface/IUserRepository';
import { Role } from '../../../domain/types/enums';
import { ITokenResponse } from '../../../domain/types/interfaces';
import { IRefreshTokenUseCase } from '../../../domain/interface/IRefreshTokenUseCase';

export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(
    private tokenService: ITokenService,
    private userRepository: IUserRepository
  ) {}

  async execute(refreshToken: string): Promise<ITokenResponse> {
    const decoded = this.tokenService.verifyRefreshToken(refreshToken);
    const user = await this.userRepository.findByRefreshToken(
      refreshToken,
      decoded.role
    );
    if (!user) throw new Error('Invalid refresh token');

    const accessToken = this.tokenService.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isInitialLogin: user.isInitialLogin,
      },
      accessToken,
    };
  }
}