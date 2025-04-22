import { Request, Response } from 'express';
import { INotificationRepository } from '../../../domain/interface/INotificationRepository';
import { MarkNotificationAsRead } from '../../../application/useCases/notification/MarkNotificationAsReadUseCase';
import { GetNotificationsUseCase } from '../../../application/useCases/notification/GetNotificationsUseCase';

export class NotificationController {
  constructor(
    private notificationRepository: INotificationRepository,
    private markNotificationAsRead: MarkNotificationAsRead,
    private getNotificationsUseCase: GetNotificationsUseCase, 
  ) {}

  getNotifications = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      console.log('Hitting the controller');
      console.log('This is the user id:', userId);
      const notifications = await this.getNotificationsUseCase.execute(userId);
      console.log('Notifications from use case:', notifications);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch notifications',
      });
    }
  };

  markAsRead = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      await this.markNotificationAsRead.execute(id, userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to mark notification as read',
      });
    }
  };
}
