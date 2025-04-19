import { ITokenService } from '../../../domain/interface/ITokenService';
import { IUserRepository } from '../../../domain/interface/IUserTokenRepository';

export class RefreshTokenUseCase {
  constructor(
    private tokenService: ITokenService,
    private userRepository: IUserRepository
  ) {}

  async execute(refreshToken: string): Promise<{
    accessToken: string;
    user: {
      id: string;
      email: string;
      role: string;
    };
  }> {
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
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
