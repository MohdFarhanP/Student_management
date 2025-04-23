import { INotification } from '../../../domain/types/interfaces';
import { INotificationRepository } from '../../../domain/interface/INotificationRepository';
import { IGetNotificationsUseCase } from '../../../domain/interface/IGetNotificationsUseCase';
import { ValidationError } from '../../../domain/errors';

export class GetNotificationsUseCase implements IGetNotificationsUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute(userId: string): Promise<INotification[]> {
    if (!userId) {
      throw new ValidationError('User ID is required');
    }
    const now = new Date().toISOString();
    const allNotifications = await this.notificationRepository.findByUserId(userId);
    console.log('All notifications fetched:', allNotifications);

    const filteredNotifications = allNotifications.filter(
      (notification) =>
        !notification.scheduledAt || notification.scheduledAt <= now
    );
    console.log('Filtered notifications:', filteredNotifications);

    return filteredNotifications;
  }
}