import { Router } from 'express';
import { authenticateUser } from '../middleware/authenticateUser';
import { IChatController } from '../controllers/chat/IChatController';

const router = Router();

let chatController: IChatController | null = null;

export const setChatController = (controller: IChatController) => {
  chatController = controller;
};

router.post('/send', authenticateUser, (req, res, next) => {
  if (!chatController) {
    throw new Error(
      'ChatController not initialized. Dependency injection failed.'
    );
  }
  chatController.sendMessage.bind(chatController)(req, res, next);
});

export default router;
