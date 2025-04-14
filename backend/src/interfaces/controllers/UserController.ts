import { Request, Response } from 'express';
import { LoginUseCase } from '../../application/useCases/auth/LoginUseCase.js';
import { UpdatePasswordUseCase } from '../../application/useCases/auth/UpdatePasswordUseCase.js';
import { RefreshTokenUseCase } from '../../application/useCases/auth/RefreshTokenUseCase.js';
import { LogoutUseCase } from '../../application/useCases/auth/LogoutUseCase.js';
import HttpStatus from '../../utils/httpStatus.js';
// import { ITokenService } from '../../domain/interface/ITokenService.js';
// import { IUserRepository } from '../../domain/interface/IUserTokenRepository.js';

const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000; // 15 minutes
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
};

interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string; role: string };
}

export class UserController {
  constructor(
    private loginUseCase: LoginUseCase,
    private updatePasswordUseCase: UpdatePasswordUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
    private logoutUseCase: LogoutUseCase
    // private tokenService: ITokenService, // Kept for consistency, though not used directly
    // private userRepository: IUserRepository // Kept for consistency, though not used directly
  ) {}

  async login(req: Request, res: Response) {
    try {
      const { email, password, role } = req.body;
      const { token, refreshToken, user } = await this.loginUseCase.execute(
        email,
        password,
        role
      );

      res.cookie('access_token', token, {
        ...cookieOptions,
        maxAge: ACCESS_TOKEN_MAX_AGE,
      });
      res.cookie('refresh_token', refreshToken, {
        ...cookieOptions,
        maxAge: REFRESH_TOKEN_MAX_AGE,
      });

      res.status(HttpStatus.OK).json({ message: 'Login successful', user });
    } catch (error: unknown) {
      console.error('Login Error:', error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Internal server error' });
      }
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refresh_token;
      if (refreshToken) {
        await this.logoutUseCase.execute(refreshToken);
      }

      res.clearCookie('access_token', cookieOptions);
      res.clearCookie('refresh_token', cookieOptions);

      res.status(HttpStatus.OK).json({ message: 'Logout successful' });
    } catch (error: unknown) {
      console.error('Logout Error:', error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Internal server error' });
      }
    }
  }

  async updatePassword(req: AuthenticatedRequest, res: Response) {
    try {
      const { password } = req.body;
      const { email, role } = req.user!;
      const user = await this.updatePasswordUseCase.execute(
        email,
        password,
        role
      );

      res.status(HttpStatus.OK).json({ message: 'Password updated', user });
    } catch (error: unknown) {
      console.error('Update Password Error:', error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Internal server error' });
      }
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies.refresh_token;
      if (!refreshToken) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'No refresh token provided' });
        return;
      }

      const result = await this.refreshTokenUseCase.execute(refreshToken);

      res.cookie('access_token', result.accessToken, {
        ...cookieOptions,
        maxAge: ACCESS_TOKEN_MAX_AGE,
      });

      res.status(HttpStatus.OK).json({
        message: 'Token refreshed',
        user: {
          id: result.user.id,
          email: result.user.email,
          role: result.user.role,
        },
      });
    } catch (error: unknown) {
      console.error('Refresh Token Error:', error);

      const message =
        error instanceof Error ? error.message : 'Internal server error';
      const status =
        error instanceof Error && error.message.includes('Invalid')
          ? HttpStatus.UNAUTHORIZED
          : HttpStatus.INTERNAL_SERVER_ERROR;

      res.status(status).json({ message });
    }
  }
}
