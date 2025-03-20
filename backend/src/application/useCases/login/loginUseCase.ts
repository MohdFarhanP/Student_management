import { AdminRepository } from '../../../infrastructure/repositories/adminRepository.js';
import { AuthService } from '../../../interfaces/authService/authService.js';

export class LoginUseCase {
  constructor(private adminRepository: AdminRepository) {}

  async execute(email: string, password: string) {
    const admin = await this.adminRepository.findByEmail(email);
    if (!admin) {
      throw new Error('Admin not found');
    }

    // Verify password using AuthService
    const isValidPassword = await AuthService.comparePasswords(
      password,
      admin.password
    );
    if (!isValidPassword) {
      throw new Error('Invalid username or password');
    }

    const token = AuthService.generateToken({
      id: admin.id,
      email: admin.email,
    });

    return {
      user: { email: admin.email },
      token,
    };
  }
}
