import cron from 'node-cron';
import { Server as SocketIOServer } from 'socket.io';
import { NotificationRepository } from '../repositories/notification/notificationReopository';
import { INotification } from '../../domain/interface/INotification';

export class NotificationScheduler {
  constructor(
    private io: SocketIOServer,
    private notificationRepository: NotificationRepository
  ) {}

  start() {
    cron.schedule('* * * * *', async () => {
      try {
        const now = new Date();
        const utcNow = new Date(now.toISOString()); // Normalize to UTC
        console.log(`Checking scheduled notifications at ${utcNow}`);
        const notifications = await this.notificationRepository.findScheduled(utcNow);
        console.log(`Found ${notifications.length} scheduled notifications`);
        console.log(`This is the notification scheduled ${notifications}`);
        for (const notification of notifications) {
          console.log(`Sending notification ${notification.id} scheduled for ${notification.scheduledAt}`);
          this.sendNotification(notification);
          await this.notificationRepository.markAsRead(
            notification.id,
            notification.senderId
          );
        }
      } catch (error) {
        console.error(
          'Error in notification scheduler:',
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    });
  }

  private sendNotification(notification: INotification) {
    if (notification.recipientType === 'global') {
      this.io.emit('notification', notification);
    } else if (notification.recipientType === 'role') { 
      notification.recipientIds?.forEach((role) => {
        this.io.to(`role-${role}`).emit('notification', notification);
      });
    } else if (notification.recipientType === 'Student') {
      notification.recipientIds?.forEach((userId) => {
        this.io.to(`user-${userId}`).emit('notification', notification);
      });
    }
  }
}