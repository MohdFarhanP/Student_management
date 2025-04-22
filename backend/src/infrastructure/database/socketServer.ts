  import { Server as SocketIOServer, Socket } from 'socket.io';
  import { MessageRepository } from '../repositories/message/messageRepository';
  import { SendMessage } from '../../application/useCases/message/sendMessage';
  import { NotificationRepository } from '../repositories/notification/notificationReopository';
  import { SendNotification } from '../../application/useCases/notification/SendNotificationUseCase';
  import { NotificationScheduler } from '../services/notificationScheduler';

  export interface SendMessageDTO {
    chatRoomId: string;
    senderId: string;
    senderRole: 'Student' | 'Teacher';
    content?: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'document';
  }

  export interface SendNotificationDTO {
    title: string;
    message: string;
    recipientType: 'global' | 'role' | 'Student';
    recipientIds?: string[];
    senderId: string;
    senderRole: 'Admin' | 'Teacher';
    scheduledAt?: Date;
  }

  export class SocketServer {
    constructor(private io: SocketIOServer) {}

    initialize() {
      const messageRepository = new MessageRepository();
      const sendMessageUseCase = new SendMessage(messageRepository);
      const notificationRepository = new NotificationRepository();
      const sendNotificationUseCase = new SendNotification(
        notificationRepository
      );
      const notificationScheduler = new NotificationScheduler(
        this.io,
        notificationRepository
      );

      notificationScheduler.start();
      
      this.io.use((socket, next) => {
        const userId = socket.handshake.query.userId as string;
        if (!userId) {
          console.error('Socket authentication failed: No userId provided');
          return next(new Error('Authentication error: userId required'));
        }
        socket.data.userId = userId;
        next();
      });

      this.io.on('connection', (socket: Socket) => {
        console.log('User connected:', socket.id, 'userId:', socket.data.userId);

        socket.on('joinRoom', (chatRoomId: string, callback) => {
          if (!chatRoomId) {
            socket.emit('error', 'Invalid chatRoomId');
            return;
          }
          socket.join(chatRoomId);
          console.log(`User ${socket.data.userId} joined room ${chatRoomId}`);
          if (callback) callback();
        });

        socket.on('joinNotification', () => {
          socket.join(`user-${socket.data.userId}`);
          console.log(`User ${socket.data.userId} joined notification room`);
        });

        socket.on('loadMessages', async (chatRoomId: string) => {
          try {
            const messages = await messageRepository.findByChatRoomId(chatRoomId);
            socket.emit('initialMessages', messages);
          } catch (error) {
            socket.emit('error', 'Failed to load messages');
          }
        });

        socket.on('sendMessage', async (message: SendMessageDTO) => {
          try {
            if (
              !message.chatRoomId ||
              !message.senderId ||
              !message.senderRole ||
              message.senderId !== socket.data.userId
            )   {
              socket.emit('error', 'Unauthorized or missing message fields');
              return;
            }
            const savedMessage = await sendMessageUseCase.execute(message);
            socket.to(message.chatRoomId).emit('message', savedMessage);
            socket.emit('message', savedMessage);
          } catch (error) {
            socket.emit(
              'error',
              error instanceof Error ? error.message : 'An unknown error occurred'
            );
          }
        });

        socket.on(
          'sendNotification',
          async (notification: SendNotificationDTO) => {
            try {
              console.log('Received notification:', notification);

              if (!notification.title) {
                socket.emit('error', 'Notification title is required');
                return;
              }
              if (!notification.message) {
                socket.emit('error', 'Notification message is required');
                return;
              }
              if (!notification.senderId) {
                socket.emit('error', 'Sender ID is required');
                return;
              }
              if (!notification.senderRole) {
                socket.emit('error', 'Sender role is required');
                return;
              }
              if (notification.senderId !== socket.data.userId) {
                socket.emit(
                  'error',
                  'Unauthorized: Sender ID does not match socket user'
                );
                return;
              }
              if (!['Admin', 'Teacher'].includes(notification.senderRole)) {
                socket.emit('error', 'Unauthorized: Invalid sender role');
                return;
              }

              const savedNotification =
                await sendNotificationUseCase.execute(notification);

              // Only emit immediately if not scheduled or scheduled time is now/past
              const now = new Date();
              console.log('nowtime',now);
              console.log('sheduled time ',notification.scheduledAt);
              if (!notification.scheduledAt || new Date(notification.scheduledAt) <= now) {
                if (notification.recipientType === 'global') {
                  this.io.emit('notification', savedNotification);
                } else if (notification.recipientType === 'role') {
                  notification.recipientIds?.forEach((role) => {
                    this.io
                      .to(`role-${role}`)
                      .emit('notification', savedNotification);
                  });
                } else if (notification.recipientType === 'Student') {
                  notification.recipientIds?.forEach((userId) => {
                    this.io
                      .to(`user-${userId}`)
                      .emit('notification', savedNotification);
                  });
                }
              }

              // Always emit back to the sender for confirmation
              socket.emit('notification', savedNotification);
            } catch (error) {
              console.error('Error processing notification:', error);
              socket.emit(
                'error',
                error instanceof Error
                  ? error.message
                  : 'Failed to send notification'
              );
            }
          }
        );

        socket.on('disconnect', () => {
          console.log('User disconnected:', socket.id);
        });
      });
    }
  }
