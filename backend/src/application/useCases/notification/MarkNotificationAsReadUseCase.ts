import { INotificationRepository } from '../../../domain/interface/INotificationRepository.js';

export class MarkNotificationAsRead {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute(notificationId: string, userId: string): Promise<void> {
    await this.notificationRepository.markAsRead(notificationId, userId);
  }
}
