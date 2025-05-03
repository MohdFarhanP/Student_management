import { Request, Response } from 'express';
import { ILoginUseCase } from '../../domain/interface/ILoginUseCase';
import { IUpdatePasswordUseCase } from '../../domain/interface/IUpdatePasswordUseCase';
import { IRefreshTokenUseCase } from '../../domain/interface/IRefreshTokenUseCase';
import { ILogoutUseCase } from '../../domain/interface/ILogoutUseCase';
import HttpStatus from '../../utils/httpStatus';
import { Role } from '../../domain/types/enums';
import { IApiResponse, IUser } from '../../domain/types/interfaces';
import { IUserController } from '../../domain/interface/IUserController';

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
      console.error('Login Error:', error);
      const message = error instanceof Error ? error.message : 'Internal server error';
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
      console.error('Logout Error:', error);
      const message = error instanceof Error ? error.message : 'Internal server error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }

  async updatePassword(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { password } = req.body;
      const { email, role } = req.user!;
      const user = await this.updatePasswordUseCase.execute(email, password, role);

      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Password updated',
        data: user,
      } as IApiResponse<IUser>);
    } catch (error: unknown) {
      console.error('Update Password Error:', error);
      const message = error instanceof Error ? error.message : 'Internal server error';
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      } as IApiResponse<never>);
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies.refresh_token;
      console.log("hitting refresh token in user controller ",refreshToken);
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
      console.error('Refresh Token Error:', error);
      const message = error instanceof Error ? error.message : 'Internal server error';
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