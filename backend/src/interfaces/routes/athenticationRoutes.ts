import { Router } from 'express';
import { UserController } from '../controllers/UserController.js';
import { UserRepository } from '../../infrastructure/repositories/userRepository.js';
import { LoginUseCase } from '../../application/useCases/admin/login/loginUseCase.js';
import { UpdatePasswordUseCase } from '../../application/useCases/admin/login/updatePasswordUseCase.js';

const router = Router();
const userRepository = new UserRepository();
const loginUseCase = new LoginUseCase(userRepository);
const updatePasswordUseCase = new UpdatePasswordUseCase(userRepository);
const userController = new UserController(loginUseCase, updatePasswordUseCase);

router.post('/login', userController.login.bind(userController));
router.post('/logout', userController.logout.bind(userController));
router.put(
  '/update-password',
  userController.updatePassword.bind(userController)
);

export default router;
