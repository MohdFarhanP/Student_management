import { IUserRepository } from '../../../domain/interface/IUserTokenRepository.js';
import { ITokenService } from '../../../domain/interface/ITokenService.js';

export class UpdatePasswordUseCase {
  constructor(
    private userRepository: IUserRepository,
    private tokenService: ITokenService
  ) {}

  async execute(email: string, password: string, role: string) {
    const user = await this.userRepository.findByEmailAndRole(email, role);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const hashedPassword = await this.tokenService.hashPassword(password);
    await this.userRepository.updatePassword(user.id, hashedPassword);

    return { email: user.email, role, isInitialLogin: false };
  }
}
