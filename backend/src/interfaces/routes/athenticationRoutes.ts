import { Router } from 'express';
import { UserController } from '../controllers/UserController.js';

const router = Router();
const userController = new UserController();

router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.put('/update-password', userController.updatePassword);

export default router;
