import express from 'express';
import { ChatController } from '../controllers/chatController.js';

const router = express.Router();
const chatController = new ChatController();

router.post('/send', chatController.sendMessage.bind(chatController));

export default router;
