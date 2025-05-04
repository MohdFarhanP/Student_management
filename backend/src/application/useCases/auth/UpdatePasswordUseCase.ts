import { IUserRepository } from '../../../domain/interface/IUserRepository';
import { IAuthService } from '../../../domain/interface/IAuthService';
import { Role } from '../../../domain/types/enums';
import { IUser } from '../../../domain/types/interfaces';
import { IUpdatePasswordUseCase } from '../../../domain/interface/IUpdatePasswordUseCase';

export class UpdatePasswordUseCase implements IUpdatePasswordUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authService: IAuthService
  ) {}

  async execute(email: string, password: string, role: Role): Promise<IUser> {
    const user = await this.userRepository.findByEmailAndRole(email, role);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const hashedPassword = await this.authService.hashPassword(password);
    await this.userRepository.updatePassword(user.id, hashedPassword);

    return { id: user.id, email: user.email, role, isInitialLogin: false };
  }
}