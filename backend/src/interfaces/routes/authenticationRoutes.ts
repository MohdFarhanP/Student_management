import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { UserRepository } from '../../infrastructure/repositories/userRepository';
import { LoginUseCase } from '../../application/useCases/auth/LoginUseCase';
import { UpdatePasswordUseCase } from '../../application/useCases/auth/UpdatePasswordUseCase';
import { RefreshTokenUseCase } from '../../application/useCases/auth/RefreshTokenUseCase';
import { LogoutUseCase } from '../../application/useCases/auth/LogoutUseCase';
import { AuthService } from '../../application/services/authService';
import { authenticateUser } from '../middleware/authenticateUser';

const router = Router();
const userRepository = new UserRepository();
const authService = new AuthService();
const loginUseCase = new LoginUseCase(userRepository, authService);
const updatePasswordUseCase = new UpdatePasswordUseCase(
  userRepository,
  authService
);
const refreshTokenUseCase = new RefreshTokenUseCase(
  authService,
  userRepository
);
const logoutUseCase = new LogoutUseCase(authService, userRepository);
const userController = new UserController(
  loginUseCase,
  updatePasswordUseCase,
  refreshTokenUseCase,
  logoutUseCase
  // authService,
  // userRepository
);

router.post('/login', userController.login.bind(userController));
router.post('/logout', userController.logout.bind(userController));
router.put(
  '/update-password',
  authenticateUser,
  userController.updatePassword.bind(userController)
);
router.post('/refresh-token', userController.refreshToken.bind(userController));

export default router;
