import { INotification } from '../../../domain/types/interfaces';
import { INotificationRepository } from '../../../domain/repositories/INotificationRepository';
import { IGetNotificationsUseCase } from '../../../domain/useCase/IGetNotificationsUseCase';
import { ValidationError } from '../../../domain/errors';

export class GetNotificationsUseCase implements IGetNotificationsUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute(userId: string, userRole: string): Promise<INotification[]> {
    if (!userId) {
      throw new ValidationError('User ID is required');
    }
    if (!userRole) {
      throw new ValidationError('User Role is required');
    }
    const now = new Date().toISOString();
    const allNotifications = await this.notificationRepository.findByUserId(
      userId,
      userRole
    );
    return allNotifications.filter((notification) => {
      if (!notification.scheduledAt) return true;

      const scheduled = new Date(notification.scheduledAt).toISOString();
      return scheduled <= now && notification.sent;
    });
  }
}
