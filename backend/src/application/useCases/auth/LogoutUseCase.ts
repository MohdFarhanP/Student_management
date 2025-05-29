import { IAuthService } from '../../services/IAuthService';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ILogoutUseCase } from '../../../domain/useCase/ILogoutUseCase';

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
