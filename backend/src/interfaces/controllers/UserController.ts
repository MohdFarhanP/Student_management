import { Request, Response } from 'express';
import { LoginUseCase } from '../../application/useCases/admin/login/loginUseCase.js';
import { UpdatePasswordUseCase } from '../../application/useCases/admin/login/updatePasswordUseCase.js';
import HttpStatus from '../../utils/httpStatus.js';

export class UserController {
  constructor(
    private loginUseCase: LoginUseCase,
    private updatePasswordUseCase: UpdatePasswordUseCase
  ) {}

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
    //...
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
