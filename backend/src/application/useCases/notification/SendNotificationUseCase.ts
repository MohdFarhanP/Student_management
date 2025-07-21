import { INotification } from '../../../domain/types/interfaces';
import { INotificationRepository } from '../../../domain/repositories/INotificationRepository';
import { ISendNotificationUseCase } from '../../../domain/useCase/ISendNotificationUseCase';
import { SendNotificationDTO } from '../../dtos/notificationDtos';
import { ValidationError } from '../../../domain/errors';
import { Server as SocketIOServer } from 'socket.io';
import { Queue } from 'bullmq';
import logger from '../../../logger';

export class SendNotification implements ISendNotificationUseCase {
  constructor(
    private notificationRepository: INotificationRepository,
    private io: SocketIOServer,
    private notificationQueue: Queue
  ) {}

  async execute(notification: SendNotificationDTO): Promise<INotification> {
    if (
      !notification.title ||
      !notification.message ||
      !notification.senderId ||
      !notification.senderRole
    ) {
      throw new ValidationError('Missing required notification fields');
    }
    if (
      notification.scheduledAt &&
      new Date(notification.scheduledAt) < new Date()
    ) {
      throw new ValidationError('Scheduled time cannot be in the past');
    }
    logger.debug('in sendnotification usecase ', notification);
    const saved = await this.notificationRepository.save(notification);

    if (notification.scheduledAt) {
      const delay = new Date(notification.scheduledAt).getTime() - Date.now();
      logger.info(`Scheduling notification ${saved.id} with delay ${delay}ms`);
      await this.notificationQueue.add('notification', saved, { delay });
    }

    return saved;
  }
}
