import { SendNotificationDTO } from '../types/interfaces';
import { INotification } from '../types/interfaces';

export interface INotificationRepository {
  save(notification: SendNotificationDTO): Promise<INotification>;
  findScheduled(currentTime: Date): Promise<INotification[]>;
  findByUserId(userId: string, userRole:string): Promise<INotification[]>;
  markAsSent(notificationId: string): Promise<void>;
  markAsRead(notificationId: string, userId: string): Promise<void>;

  //   findByRecipientId(recipientId: string): Promise<INotification[]>;
  // create(notification: INotification): Promise<INotification>;
}
