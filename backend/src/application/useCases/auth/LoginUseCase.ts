import { IUserRepository } from '../../../domain/interface/IUserTokenRepository.js';
import { ITokenService } from '../../../domain/interface/ITokenService.js';

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private tokenService: ITokenService,
    private defaultPasswords: { [key: string]: string } = {
      Student: 'student123',
      Teacher: 'teacher123',
    }
  ) {}

  async execute(email: string, password: string, role: string) {
    const user = await this.userRepository.findByEmailAndRole(email, role);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    let isInitialLogin = false;
    if (role !== 'Admin' && password === this.defaultPasswords[role]) {
      isInitialLogin = true;
    } else if (
      !(await this.tokenService.comparePasswords(password, user.password))
    ) {
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
      user: { email: user.email, role, isInitialLogin },
      token,
      refreshToken,
    };
  }
}
