import { Router } from 'express';
import { DependencyContainer } from '../../infrastructure/di/container';
import { authenticateUser } from '../middleware/authenticateUser';

const router = Router();
const container = DependencyContainer.getInstance();
const userController = container.getUserController();

router.post('/login', userController.login.bind(userController));
router.post('/logout', userController.logout.bind(userController));
router.put(
  '/update-password',
  authenticateUser,
  userController.updatePassword.bind(userController)
);
router.post('/refresh-token', userController.refreshToken.bind(userController));

export default router;