import { Router } from 'express';
import { INotificationController } from '../../controllers/notification/INotificationController';
import { authenticateUser } from '../../middleware/authenticateUser';

const router = Router();

let notificationController: INotificationController | null = null;

export const setNotificationController = (
  controller: INotificationController
) => {
  notificationController = controller;
};

router.get('/', authenticateUser, (req, res, next) => {
  if (!notificationController) {
    throw new Error(
      'NotificationController not initialized. Dependency injection failed.'
    );
  }
  notificationController.getNotifications.bind(notificationController)(
    req,
    res,
    next
  );
});

router.patch('/:notificationId/read', authenticateUser, (req, res, next) => {
  if (!notificationController) {
    throw new Error(
      'NotificationController not initialized. Dependency injection failed.'
    );
  }
  notificationController.markAsRead.bind(notificationController)(
    req,
    res,
    next
  );
});

export default router;
