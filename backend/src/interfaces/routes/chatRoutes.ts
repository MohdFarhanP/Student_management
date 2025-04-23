import { Router } from 'express';
import { authenticateUser } from '../middleware/authenticateUser';
import { DependencyContainer } from '../../infrastructure/di/container';

const router = Router();
const container = DependencyContainer.getInstance();
const chatController = container.getChatController();

router.post('/send', authenticateUser, chatController.sendMessage.bind(chatController));

export default router;
