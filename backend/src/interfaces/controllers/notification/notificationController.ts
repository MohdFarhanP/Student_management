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
      const {userId, userRole} = req.query;
      
      if (typeof userId !== 'string' || typeof userRole !== 'string') {
        throw new Error('Invalid query parameters');
      }
      if (!userId) {
        throw new UnauthorizedError('User not authenticated');
      }
      
      const notifications = await this.getNotificationsUseCase.execute(userId, userRole);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Notification fetched successfully',
        data: notifications,
      });
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
      const { notificationId } = req.params;
      const {id,role} = req.user;
      if (!id) {
        throw new UnauthorizedError('User not authenticated');
      }
      if (!notificationId) {
        throw new ValidationError('Notification ID is required');
      }
      await this.markNotificationAsRead.execute(notificationId, id, role);
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