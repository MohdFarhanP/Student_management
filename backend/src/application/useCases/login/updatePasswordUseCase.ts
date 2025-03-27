import { UserRepository } from '../../../infrastructure/repositories/userRepository.js';
import { AuthService } from '../../../interfaces/authService/authService.js';

export class UpdatePasswordUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string, password: string, role: string) {
    const user = await this.userRepository.findByEmailAndRole(email, role);
    if (!user) {
      throw new Error(`${role} not found`);
    }

    const hashedPassword = await AuthService.hashPassword(password);
    await this.userRepository.updatePassword(user.id, hashedPassword);

    return { email: user.email, role, isInitialLogin: false };
  }
}
