import { Request, Response } from 'express';
import { ILoginUseCase } from '../../../domain/useCase/ILoginUseCase';
import { IUpdatePasswordUseCase } from '../../../domain/useCase/IUpdatePasswordUseCase';
import { IRefreshTokenUseCase } from '../../../domain/useCase/IRefreshTokenUseCase';
import { ILogoutUseCase } from '../../../domain/useCase/ILogoutUseCase';
import { HttpStatus } from '../../../domain/types/enums';
import { Role } from '../../../domain/types/enums';
import { IApiResponse, IUser } from '../../../domain/types/interfaces';
import { IUserController } from './IUserController';
import { BadRequestError } from '../../../domain/errors';
import logger from '../../../logger';

const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000; // 15 minutes
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: 'strict' as const,
};

interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string; role: Role };
}

export class UserController implements IUserController {
  constructor(
    private loginUseCase: ILoginUseCase,
    private updatePasswordUseCase: IUpdatePasswordUseCase,
    private refreshTokenUseCase: IRefreshTokenUseCase,
    private logoutUseCase: ILogoutUseCase
  ) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, role } = req.body;
      const result = await this.loginUseCase.execute(email, password, role);

      res.cookie('access_token', result.accessToken, {
        ...cookieOptions,
        maxAge: ACCESS_TOKEN_MAX_AGE,
      });
      res.cookie('refresh_token', result.refreshToken!, {
        ...cookieOptions,
        maxAge: REFRESH_TOKEN_MAX_AGE,
      });

      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Login successful',
        data: result.user,
      } as IApiResponse<IUser>);
    } catch (error: unknown) {
      logger.error('Login Error:', error);
      const message =
        error instanceof Error ? error.message : 'Internal server error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies.refresh_token;
      if (refreshToken) {
        await this.logoutUseCase.execute(refreshToken);
      }

      res.clearCookie('access_token', cookieOptions);
      res.clearCookie('refresh_token', cookieOptions);

      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Logout successful',
      } as IApiResponse<never>);
    } catch (error: unknown) {
      logger.error('Logout Error:', error);
      const message =
        error instanceof Error ? error.message : 'Internal server error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }

  async updatePassword(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { password } = req.body;
      if (!password || typeof password !== 'string') {
        throw new BadRequestError('Password is required and must be a string');
      }
      if (password.length < 6) {
        throw new BadRequestError('Password must be at least 6 characters');
      }

      const { email, role } = req.user;

      const validRoles = [Role.Admin, Role.Student, Role.Teacher];
      if (!validRoles.includes(role as Role)) {
        throw new Error('Invalid user role');
      }

      const user = await this.updatePasswordUseCase.execute(
        email,
        password,
        role as Role
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Password updated',
        data: user,
      } as IApiResponse<IUser>);
    } catch (error: unknown) {
      logger.error('Update Password Error:', error);
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies.refresh_token;
      if (!refreshToken) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: 'No refresh token provided',
        } as IApiResponse<never>);
        return;
      }

      const result = await this.refreshTokenUseCase.execute(refreshToken);

      res.cookie('access_token', result.accessToken, {
        ...cookieOptions,
        maxAge: ACCESS_TOKEN_MAX_AGE,
      });

      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Token refreshed',
        data: result.user,
      } as IApiResponse<IUser>);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Internal server error';
      const status =
        error instanceof Error && error.message.includes('Invalid')
          ? HttpStatus.UNAUTHORIZED
          : HttpStatus.INTERNAL_SERVER_ERROR;

      res.status(status).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }
}
