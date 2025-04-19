import { IUserRepository } from '../../../domain/interface/IUserTokenRepository';
import { ITokenService } from '../../../domain/interface/ITokenService';

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private tokenService: ITokenService
  ) {}

  async execute(email: string, password: string, role: string) {
    const user = await this.userRepository.findByEmailAndRole(email, role);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!(await this.tokenService.comparePasswords(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const token = this.tokenService.generateToken({
      id: user.id,
      email: user.email,
      role,
    });
    const refreshToken = this.tokenService.generateRefreshToken({
      email: user.email,
      role,
    });

    await this.userRepository.updateRefreshToken(user.id, refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        role,
        isInitialLogin: user.isInitialLogin,
      },
      token,
      refreshToken,
    };
  }
}
