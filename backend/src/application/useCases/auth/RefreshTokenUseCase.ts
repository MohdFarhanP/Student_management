import { IAuthService } from '../../../domain/interface/IAuthService';
import { IUserRepository } from '../../../domain/interface/IUserRepository';
import { Role } from '../../../domain/types/enums';
import { ITokenResponse } from '../../../domain/types/interfaces';
import { IRefreshTokenUseCase } from '../../../domain/interface/IRefreshTokenUseCase';

export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(
    private authService: IAuthService,
    private userRepository: IUserRepository
  ) {}

  async execute(refreshToken: string): Promise<ITokenResponse> {
    const decoded = this.authService.verifyRefreshToken(refreshToken);
    const user = await this.userRepository.findByRefreshToken(
      refreshToken,
      decoded.role
    );
    if (!user) throw new Error('Invalid refresh token');

    const accessToken = this.authService.generateToken({
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