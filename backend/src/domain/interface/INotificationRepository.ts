import { SendNotificationDTO } from '../../infrastructure/database/socketServer.js';
import { INotification } from './INotification.js';

export interface INotificationRepository {
  save(notification: SendNotificationDTO): Promise<INotification>;
  findByUserId(userId: string): Promise<INotification[]>;
  markAsRead(notificationId: string, userId: string): Promise<void>;
}
