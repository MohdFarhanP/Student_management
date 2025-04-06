import { ITokenService } from '../../../domain/interface/ITokenService.js';
import { IUserRepository } from '../../../domain/interface/IUserTokenRepository.js';

export class LogoutUseCase {
  constructor(
    private tokenService: ITokenService,
    private userRepository: IUserRepository
  ) {}

  async execute(refreshToken: string): Promise<void> {
    const decoded = this.tokenService.verifyRefreshToken(refreshToken);
    const user = await this.userRepository.findByRefreshToken(
      refreshToken,
      decoded.role
    );
    if (user) {
      await this.userRepository.updateRefreshToken(user.id, null);
    }
  }
}
