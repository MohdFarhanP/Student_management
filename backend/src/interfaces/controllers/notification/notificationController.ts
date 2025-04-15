import { Request, Response } from 'express';
import { INotificationRepository } from '../../../domain/interface/INotificationRepository.js';
import { MarkNotificationAsRead } from '../../../application/useCases/notification/MarkNotificationAsReadUseCase.js';

export class NotificationController {
  constructor(
    private notificationRepository: INotificationRepository,
    private markNotificationAsRead: MarkNotificationAsRead
  ) {}

  getNotifications = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const notifications =
        await this.notificationRepository.findByUserId(userId);
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
