import { INotification } from '../../../domain/types/interfaces';
import { INotificationRepository } from '../../../domain/interface/INotificationRepository';
import { ISendNotificationUseCase } from '../../../domain/interface/ISendNotificationUseCase';
import { SendNotificationDTO } from '../../../domain/types/interfaces';
import { ValidationError } from '../../../domain/errors';

export class SendNotification implements ISendNotificationUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute(notification: SendNotificationDTO): Promise<INotification> {
    if (
      !notification.title ||
      !notification.message ||
      !notification.senderId ||
      !notification.senderRole
    ) {
      throw new ValidationError('Missing required notification fields');
    }
    if (notification.scheduledAt && notification.scheduledAt < new Date()) {
      throw new ValidationError('Scheduled time cannot be in the past');
    }
    return await this.notificationRepository.save(notification);
  }
}