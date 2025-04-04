import { IUserRepository } from '../../../../domain/interface/IUserRepository.js';
import { AuthService } from '../../../../interfaces/authService/authService.js';

export class LoginUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, password: string, role: string) {
    const user = await this.userRepository.findByEmailAndRole(email, role);
    if (!user) {
      throw new Error(`${role} not found`);
    }

    const defaultPasswords: { [key: string]: string } = {
      Student: 'student123',
      Teacher: 'teacher123',
    };

    let isInitialLogin = false;
    if (role !== 'Admin' && password === defaultPasswords[role]) {
      isInitialLogin = true;
    } else if (!(await AuthService.comparePasswords(password, user.password))) {
      throw new Error('Invalid username or password');
    }

    const token = AuthService.generateToken({
      id: user.id,
      email: user.email,
      role,
    });

    return {
      user: { email: user.email, role, isInitialLogin },
      token,
    };
  }
}
