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

router.post('/login', (req, res) => userController.login(req, res));
router.post('/logout', (req, res) => userController.logout(req, res));
router.put('/update-password', (req, res) =>
  userController.updatePassword(req, res)
);

export default router;
