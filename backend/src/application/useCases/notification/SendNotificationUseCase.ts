import { INotification } from '../../../domain/interface/INotification';
import { INotificationRepository } from '../../../domain/interface/INotificationRepository';
import { SendNotificationDTO } from '../../../infrastructure/database/socketServer';

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
