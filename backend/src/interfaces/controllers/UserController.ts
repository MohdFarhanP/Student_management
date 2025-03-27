import { Request, Response } from 'express';
import { UserRepository } from '../../infrastructure/repositories/userRepository.js';
import { LoginUseCase } from '../../application/useCases/login/loginUseCase.js';
import { UpdatePasswordUseCase } from '../../application/useCases/login/updatePasswordUseCase.js';
import HttpStatus from '../../utils/httpStatus.js';

export class UserController {
  private loginUseCase: LoginUseCase;
  private updatePasswordUseCase: UpdatePasswordUseCase;

  constructor() {
    const userRepository = new UserRepository();
    this.loginUseCase = new LoginUseCase(userRepository);
    this.updatePasswordUseCase = new UpdatePasswordUseCase(userRepository);
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password, role } = req.body;
      const { token, user } = await this.loginUseCase.execute(
        email,
        password,
        role
      );

      res.cookie('access_token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
      });

      res.status(HttpStatus.OK).json({ message: 'Login successful', user });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      }
    }
  }

  async logout(req: Request, res: Response) {
    try {
      res.cookie('access_token', '', {
        httpOnly: true,
        expires: new Date(0),
        secure: false,
        sameSite: 'strict',
      });
      res.status(HttpStatus.OK).json({ message: 'Logout successful' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  }

  async updatePassword(req: Request, res: Response) {
    try {
      const { email, password, role } = req.body;
      const user = await this.updatePasswordUseCase.execute(
        email,
        password,
        role
      );
      res.status(HttpStatus.OK).json({ message: 'Password updated', user });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      }
    }
  }
}
