import { SendNotificationDTO } from '../../infrastructure/database/socketServer';
import { INotification } from './INotification';

export interface INotificationRepository {
  save(notification: SendNotificationDTO): Promise<INotification>;
  findByUserId(userId: string): Promise<INotification[]>;
  markAsRead(notificationId: string, userId: string): Promise<void>;
}
