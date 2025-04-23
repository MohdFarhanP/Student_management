import { Server as SocketIOServer, Socket } from 'socket.io';
import { ISocketServer } from '../../domain/interface/ISocketServer';
import { IMessageRepository } from '../../domain/interface/IMessageRepository';
import { ISendMessageUseCase } from '../../domain/interface/ISendMessageUseCase';
import { INotificationRepository } from '../../domain/interface/INotificationRepository';
import { ISendNotificationUseCase } from '../../domain/interface/ISendNotificationUseCase';
import { INotificationScheduler } from '../../domain/interface/INotificationScheduler';
import { SendMessageDTO, SendNotificationDTO } from '../../domain/types/interfaces';
import { ValidationError, UnauthorizedError, ForbiddenError } from '../../domain/errors';
import { Role, RecipientType } from '../../domain/types/enums';


export class SocketServer implements ISocketServer {
  constructor(
    private io: SocketIOServer,
    private messageRepository: IMessageRepository,
    private sendMessageUseCase: ISendMessageUseCase,
    private notificationRepository: INotificationRepository,
    private sendNotificationUseCase: ISendNotificationUseCase,
    private notificationScheduler: INotificationScheduler
  ) {}

  getIo(): SocketIOServer {
    return this.io;
  }

  initialize() {
    this.notificationScheduler.start();

    this.io.use((socket, next) => {
      const userId = socket.handshake.query.userId as string;
      if (!userId) {
        return next(new ValidationError('Authentication error: userId required'));
      }
      socket.data.userId = userId;
      next();
    });

    this.io.on('connection', (socket: Socket) => {
      console.log('User connected:', socket.id, 'userId:', socket.data.userId);

      socket.on('joinRoom', (chatRoomId: string, callback) => {
        if (!chatRoomId) {
          socket.emit('error', new ValidationError('Invalid chatRoomId').message);
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
          const messages = await this.messageRepository.findByChatRoomId(chatRoomId);
          socket.emit('initialMessages', messages);
        } catch (error) {
          socket.emit('error', error instanceof Error ? error.message : 'Failed to load messages');
        }
      });

      socket.on('sendMessage', async (message: SendMessageDTO) => {
        try {
          if (
            !message.chatRoomId ||
            !message.senderId ||
            !message.senderRole ||
            message.senderId !== socket.data.userId
          ) {
            throw new UnauthorizedError('Unauthorized or missing message fields');
          }
          const savedMessage = await this.sendMessageUseCase.execute(message);
          socket.to(message.chatRoomId).emit('message', savedMessage);
          socket.emit('message', savedMessage);
        } catch (error) {
          socket.emit(
            'error',
            error instanceof Error ? error.message : 'An unknown error occurred'
          );
        }
      });

      socket.on('sendNotification', async (notification: SendNotificationDTO) => {
        try {
          if (!notification.title) {
            throw new ValidationError('Notification title is required');
          }
          if (!notification.message) {
            throw new ValidationError('Notification message is required');
          }
          if (!notification.senderId) {
            throw new ValidationError('Sender ID is required');
          }
          if (!notification.senderRole) {
            throw new ValidationError('Sender role is required');
          }
          if (notification.senderId !== socket.data.userId) {
            throw new UnauthorizedError('Unauthorized: Sender ID does not match socket user');
          }
          if (![Role.Admin, Role.Teacher].includes(notification.senderRole)) {
            throw new ForbiddenError('Unauthorized: Invalid sender role');
          }

          const savedNotification = await this.sendNotificationUseCase.execute(notification);

          const now = new Date();
          if (!notification.scheduledAt || new Date(notification.scheduledAt) <= now) {
            if (notification.recipientType === RecipientType.Global) {
              this.io.emit('notification', savedNotification);
            } else if (notification.recipientType === RecipientType.Role) {
              notification.recipientIds?.forEach((role) => {
                this.io
                  .to(`role-${role}`)
                  .emit('notification', savedNotification);
              });
            } else if (notification.recipientType === RecipientType.Student) {
              notification.recipientIds?.forEach((userId) => {
                this.io
                  .to(`user-${userId}`)
                  .emit('notification', savedNotification);
              });
            }
          }

          socket.emit('notification', savedNotification);
        } catch (error) {
          console.error('Error processing notification:', error);
          socket.emit(
            'error',
            error instanceof Error ? error.message : 'Failed to send notification'
          );
        }
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
  }
}