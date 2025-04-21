import { INotificationRepository } from '../../../domain/interface/INotificationRepository';
import { SendNotificationDTO } from '../../../infrastructure/database/socketServer';
import { INotification } from '../../../domain/interface/INotification';

export class SendNotification {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute(notification: SendNotificationDTO): Promise<INotification> {
    if (
      !notification.title ||
      !notification.message ||
      !notification.senderId ||
      !notification.senderRole
    ) {
      throw new Error('Missing required notification fields');
    }
    // Validate scheduledAt if provided
    if (notification.scheduledAt && notification.scheduledAt < new Date()) {
      throw new Error('Scheduled time cannot be in the past');
    }
    return await this.notificationRepository.save(notification);
  }
}