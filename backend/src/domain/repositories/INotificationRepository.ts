import { SendNotificationDTO } from '../../application/dtos/notificationDtos';
import { INotification } from '../types/interfaces';

export interface INotificationRepository {
  save(notification: SendNotificationDTO): Promise<INotification>;
  findScheduled(currentTime: Date): Promise<INotification[]>;
  findByUserId(userId: string, userRole: string): Promise<INotification[]>;
  markAsSent(notificationId: string): Promise<void>;
  markAsRead(
    notificationId: string,
    userId: string,
    userRole: string
  ): Promise<void>;
}
