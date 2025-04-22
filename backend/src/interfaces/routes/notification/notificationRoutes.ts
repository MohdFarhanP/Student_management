import express from 'express';
import { INotificationRepository } from '../../../domain/interface/INotificationRepository';
import { NotificationRepository } from '../../../infrastructure/repositories/notification/notificationReopository';
import { MarkNotificationAsRead } from '../../../application/useCases/notification/MarkNotificationAsReadUseCase';
import { NotificationController } from '../../controllers/notification/notificationController';
import { authenticateUser } from '../../middleware/authenticateUser';
import { GetNotificationsUseCase } from '../../../application/useCases/notification/GetNotificationsUseCase';

const router = express.Router();

const notificationRepository: INotificationRepository =
  new NotificationRepository();
const markNotificationAsReadUseCase = new MarkNotificationAsRead(
  notificationRepository
);
const getNotificationsUseCase = new GetNotificationsUseCase(
  notificationRepository
)
const notificationController = new NotificationController(
  notificationRepository,
  markNotificationAsReadUseCase,
  getNotificationsUseCase
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
