import { Queue, Worker } from 'bullmq';
import { Server as SocketIOServer } from 'socket.io';
import { INotificationRepository } from '../../domain/repositories/INotificationRepository';
import { INotification } from '../../domain/types/interfaces';
import { RecipientType } from '../../domain/types/enums';
import logger from '../../logger';

export const setupNotificationQueue = (
  io: SocketIOServer,
  notificationRepository: INotificationRepository,
  notificationQueue: Queue
): Worker => {
  const worker = new Worker(
    'notifications',
    async (job) => {
      const notification = job.data as INotification;

      if (notification.recipientType === RecipientType.Global) {
        io.emit('notification', notification);
      } else if (notification.recipientType === RecipientType.Role) {
        notification.recipientIds?.forEach((role) => {
          io.to(`role-${role}`).emit('notification', notification);
        });
      } else if (notification.recipientType === RecipientType.Student) {
        notification.recipientIds?.forEach((userId) => {
          io.to(`user-${userId}`).emit('notification', notification);
        });
      }

      await notificationRepository.markAsSent(notification.id);
    },
    {
      connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || '',
      },
    }
  );

  worker.on('error', (error) => {
    logger.error('Worker error:', error);
  });

  worker.on('completed', (job) => {
    logger.info(`Job ${job.id} completed`);
  });

  worker.on('failed', (job, error) => {
    logger.error(`Job ${job.id} failed with error:`, error);
  });

  return worker;
};
