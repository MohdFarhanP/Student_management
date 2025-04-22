import { IUserRepository } from '../../../domain/interface/IUserRepository';
import { ITokenService } from '../../../domain/interface/ITokenService';
import { Role } from '../../../domain/types/enums';
import { IUser } from '../../../domain/types/interfaces';
import { IUpdatePasswordUseCase } from '../../../domain/interface/IUpdatePasswordUseCase';

export class UpdatePasswordUseCase implements IUpdatePasswordUseCase {
  constructor(
    private userRepository: IUserRepository,
    private tokenService: ITokenService
  ) {}

  async execute(email: string, password: string, role: Role): Promise<IUser> {
    const user = await this.userRepository.findByEmailAndRole(email, role);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const hashedPassword = await this.tokenService.hashPassword(password);
    await this.userRepository.updatePassword(user.id, hashedPassword);

    return { id: user.id, email: user.email, role, isInitialLogin: false };
  }
}