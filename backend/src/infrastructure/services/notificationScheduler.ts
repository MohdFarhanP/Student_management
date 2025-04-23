import { Server as SocketIOServer } from 'socket.io';
import { INotificationRepository } from '../../domain/interface/INotificationRepository';
import { INotificationScheduler } from '../../domain/interface/INotificationScheduler';
import { RecipientType } from '../../domain/types/enums';

export class NotificationScheduler implements INotificationScheduler {
  private intervalId?: NodeJS.Timeout;

  constructor(
    private io: SocketIOServer,
    private notificationRepository: INotificationRepository
  ) {}

  start() {
    this.intervalId = setInterval(async () => {
      try {
        const currentTime = new Date();
        const notifications = await this.notificationRepository.findScheduled(currentTime);
        for (const notification of notifications) {
          if (notification.recipientType === RecipientType.Global) {
            this.io.emit('notification', notification);
          } else if (notification.recipientType === RecipientType.Role) {
            notification.recipientIds?.forEach((role) => {
              this.io.to(`role-${role}`).emit('notification', notification);
            });
          } else if (notification.recipientType === RecipientType.Student) {
            notification.recipientIds?.forEach((userId) => {
              this.io.to(`user-${userId}`).emit('notification', notification);
            });
          }
          await this.notificationRepository.markAsRead(notification.id, notification.senderId);
        }
      } catch (error) {
        console.error('Error processing scheduled notifications:', error);
      }
    }, 60000); // Run every minute
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
}