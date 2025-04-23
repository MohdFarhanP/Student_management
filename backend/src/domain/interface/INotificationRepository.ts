import { SendNotificationDTO } from '../types/interfaces';
import { INotification } from '../types/interfaces';

export interface INotificationRepository {
  findScheduled(currentTime: Date): Promise<INotification[]>
  save(notification: SendNotificationDTO): Promise<INotification>;
  findByUserId(userId: string): Promise<INotification[]>;
  markAsRead(notificationId: string, userId: string): Promise<void>;
}
