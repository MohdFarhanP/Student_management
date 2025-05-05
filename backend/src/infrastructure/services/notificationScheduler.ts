import { Server as SocketIOServer } from 'socket.io';
import { INotificationRepository } from '../../domain/interface/INotificationRepository';
import { INotificationScheduler } from '../../domain/interface/INotificationScheduler';
import { RecipientType } from '../../domain/types/enums';

export class NotificationScheduler implements INotificationScheduler {
  private intervalId?: NodeJS.Timeout;

  constructor(
    private io: SocketIOServer,
    private notificationRepository: INotificationRepository
  ) {
    console.log('NotificationScheduler initialized');
  }

  start() {
    console.log('NotificationScheduler starting...');
    this.intervalId = setInterval(async () => {
      try {
        const currentTime = new Date();
        console.log(`NotificationScheduler running at ${currentTime.toISOString()}`);
        const notifications = await this.notificationRepository.findScheduled(currentTime);
        console.log(`Found ${notifications.length} scheduled notifications`);

        for (const notification of notifications) {
          console.log(`Processing notification ${notification.id} with scheduledAt ${notification.scheduledAt}`);
          if (notification.recipientType === RecipientType.Global) {
            console.log(`Emitting global notification ${notification.id}`);
            this.io.emit('notification', notification);
          } else if (notification.recipientType === RecipientType.Role) {
            notification.recipientIds?.forEach((role) => {
              console.log(`Emitting notification ${notification.id} to role-${role}`);
              this.io.to(`role-${role}`).emit('notification', notification);
            });
          } else if (notification.recipientType === RecipientType.Student) {
            notification.recipientIds?.forEach((userId) => {
              console.log(`Emitting notification ${notification.id} to user-${userId}`);
              this.io.to(`user-${userId}`).emit('notification', notification);
            });
          }
          await this.notificationRepository.markAsSent(notification.id);
          console.log(`Marked notification ${notification.id} as sent`);
        }
      } catch (error) {
        console.error('Error processing scheduled notifications:', error);
      }
    }, 15000); // Run every 15 seconds
  }

  stop() {
    console.log('NotificationScheduler stopping...');
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  // For manual testing
  async processNow() {
    try {
      const currentTime = new Date();
      console.log(`Manual processNow triggered at ${currentTime.toISOString()}`);
      const notifications = await this.notificationRepository.findScheduled(currentTime);
      console.log(`Found ${notifications.length} scheduled notifications`);

      for (const notification of notifications) {
        console.log(`Processing notification ${notification.id} with scheduledAt ${notification.scheduledAt}`);
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
        await this.notificationRepository.markAsSent(notification.id);
      }
    } catch (error) {
      console.error('Error in processNow:', error);
    }
  }
}