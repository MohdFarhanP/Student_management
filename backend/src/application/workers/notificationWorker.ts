import { Queue, Worker } from 'bullmq';
   import { Server as SocketIOServer } from 'socket.io';
   import { INotificationRepository } from '../../domain/interface/INotificationRepository';
   import { INotification } from '../../domain/types/interfaces';
   import { RecipientType } from '../../domain/types/enums';

   export const setupNotificationQueue = (
     io: SocketIOServer,
     notificationRepository: INotificationRepository,
     notificationQueue: Queue
   ): Worker => {
     const worker = new Worker(
       'notifications',
       async (job) => {
         const notification = job.data as INotification;
         console.log(`Processing queued notification ${notification.id} at ${new Date().toISOString()}`);

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
         console.log(`Marked notification ${notification.id} as sent`);
       },
       {
         connection: {
           host: '127.0.0.1',
           port: 6379,
         },
       }
     );

     worker.on('error', (error) => {
       console.error('Worker error:', error);
     });

     worker.on('completed', (job) => {
       console.log(`Job ${job.id} completed`);
     });

     worker.on('failed', (job, error) => {
       console.error(`Job ${job.id} failed with error:`, error);
     });

     return worker;
   };