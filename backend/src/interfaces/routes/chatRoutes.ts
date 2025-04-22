import express from 'express';
import { ChatController } from '../controllers/chatController';
import { authenticateUser } from '../middleware/authenticateUser';

const router = express.Router();
const chatController = new ChatController();

router.post('/send', authenticateUser, chatController.sendMessage.bind(chatController));

export default router;
