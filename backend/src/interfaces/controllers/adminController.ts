import { Request, Response } from 'express';
import { AdminRepository } from '../../infrastructure/repositories/adminRepository.js';
import { LoginUseCase } from '../../application/useCases/login/loginUseCase.js';
import HttpStatus from '../../utils/httpStatus.js';

const adminRepository = new AdminRepository();
const loginUseCase = new LoginUseCase(adminRepository);

export class AdminController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { token, user } = await loginUseCase.execute(email, password);

      res.cookie('access_token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
      });

      res.status(HttpStatus.OK).json({ message: 'Login successful', user });
      return;
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        return;
      }
    }
  }
  static async logout(req: Request, res: Response) {
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
}
