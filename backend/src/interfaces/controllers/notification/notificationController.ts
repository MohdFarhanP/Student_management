import { Request, Response } from 'express';
import { INotificationController } from '../../../domain/interface/INotificationController';
import { INotificationRepository } from '../../../domain/interface/INotificationRepository';
import { IMarkNotificationAsRead } from '../../../domain/interface/IMarkNotificationAsRead';
import { IGetNotificationsUseCase } from '../../../domain/interface/IGetNotificationsUseCase';
import { AppError, ValidationError, UnauthorizedError } from '../../../domain/errors';
import HttpStatus from '../../../utils/httpStatus';

export class NotificationController implements INotificationController {
  constructor(
    private notificationRepository: INotificationRepository,
    private markNotificationAsRead: IMarkNotificationAsRead,
    private getNotificationsUseCase: IGetNotificationsUseCase
  ) {}

  async getNotifications(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new UnauthorizedError('User not authenticated');
      }
      console.log('Hitting the controller');
      console.log('This is the user id:', userId);
      const notifications = await this.getNotificationsUseCase.execute(userId);
      console.log('Notifications from use case:', notifications);
      res.status(HttpStatus.OK).json(notifications);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        console.error(error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          error: error instanceof Error ? error.message : 'Failed to fetch notifications',
        });
      }
    }
  }

  async markAsRead(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      if (!userId) {
        throw new UnauthorizedError('User not authenticated');
      }
      if (!id) {
        throw new ValidationError('Notification ID is required');
      }
      await this.markNotificationAsRead.execute(id, userId);
      res.status(HttpStatus.OK).json({ success: true });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        console.error(error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          error: error instanceof Error ? error.message : 'Failed to mark notification as read',
        });
      }
    }
  }
}