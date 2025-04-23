import { INotificationRepository } from '../../../domain/interface/INotificationRepository';
import { IMarkNotificationAsRead } from '../../../domain/interface/IMarkNotificationAsRead';
import { ValidationError, NotFoundError } from '../../../domain/errors';

export class MarkNotificationAsRead implements IMarkNotificationAsRead {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute(notificationId: string, userId: string): Promise<void> {
    if (!notificationId || !userId) {
      throw new ValidationError('Notification ID and user ID are required');
    }
    try {
      await this.notificationRepository.markAsRead(notificationId, userId);
    } catch (error) {
      throw new NotFoundError('Notification not found or not accessible');
    }
  }
}