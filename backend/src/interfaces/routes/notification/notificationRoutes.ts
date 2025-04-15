import express from 'express';
import { INotificationRepository } from '../../../domain/interface/INotificationRepository.js';
import { NotificationRepository } from '../../../infrastructure/repositories/notification/notificationReopository.js';
import { MarkNotificationAsRead } from '../../../application/useCases/notification/MarkNotificationAsReadUseCase.js';
import { NotificationController } from '../../controllers/notification/notificationController.js';
import { authenticateUser } from '../../middleware/authenticateUser.js';

const router = express.Router();

const notificationRepository: INotificationRepository =
  new NotificationRepository();
const markNotificationAsReadUseCase = new MarkNotificationAsRead(
  notificationRepository
);
const notificationController = new NotificationController(
  notificationRepository,
  markNotificationAsReadUseCase
);

router.get(
  '/',
  authenticateUser,
  notificationController.getNotifications.bind(notificationController)
);
router.put(
  '/:id/read',
  authenticateUser,
  notificationController.markAsRead.bind(notificationController)
);

export default router;
