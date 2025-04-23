import { Router } from 'express';
import { INotificationController } from '../../../domain/interface/INotificationController';
import { authenticateUser } from '../../middleware/authenticateUser';
import { DependencyContainer } from '../../../infrastructure/di/container';

const router = Router();
const container = DependencyContainer.getInstance();
const notificationController: INotificationController = container.getNotificationController();

router.get('/', authenticateUser, notificationController.getNotifications.bind(notificationController));
router.put('/:id/read', authenticateUser, notificationController.markAsRead.bind(notificationController));

export default router;