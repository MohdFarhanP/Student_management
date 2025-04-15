import { INotification } from '../../../domain/interface/INotification.js';
import { INotificationRepository } from '../../../domain/interface/INotificationRepository.js';
import { SendNotificationDTO } from '../../../infrastructure/database/socketServer.js';

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
    return await this.notificationRepository.save(notification);
  }
}
