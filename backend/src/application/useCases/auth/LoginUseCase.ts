import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IAuthService } from '../../services/IAuthService';
import { Role } from '../../../domain/types/enums';
import { ITokenResponse } from '../../../domain/types/interfaces';
import { ILoginUseCase } from '../../../domain/useCase/ILoginUseCase';

export class LoginUseCase implements ILoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authService: IAuthService
  ) {}

  async execute(
    email: string,
    password: string,
    role: Role
  ): Promise<ITokenResponse> {
    const user = await this.userRepository.findByEmailAndRole(email, role);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!(await this.authService.comparePasswords(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const token = this.authService.generateToken({
      id: user.id,
      email: user.email,
      role,
    });
    const refreshToken = this.authService.generateRefreshToken({
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
      accessToken: token,
      refreshToken,
    };
  }
}
