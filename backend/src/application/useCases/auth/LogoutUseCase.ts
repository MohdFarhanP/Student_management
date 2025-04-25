import { IAuthService } from '../../../domain/interface/IAuthService';
import { IUserRepository } from '../../../domain/interface/IUserRepository';
import { Role } from '../../../domain/types/enums';
import { ILogoutUseCase } from '../../../domain/interface/ILogoutUseCase';

export class LogoutUseCase implements ILogoutUseCase {
  constructor(
    private authService: IAuthService,
    private userRepository: IUserRepository
  ) {}

  async execute(refreshToken: string): Promise<void> {
    const decoded = this.authService.verifyRefreshToken(refreshToken);
    const user = await this.userRepository.findByRefreshToken(
      refreshToken,
      decoded.role
    );
    if (user) {
      await this.userRepository.updateRefreshToken(user.id, null);
    }
  }
}