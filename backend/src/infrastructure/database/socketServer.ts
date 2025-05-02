import { Server as SocketIOServer, Socket } from 'socket.io';
import { ISocketServer } from '../../domain/interface/ISocketServer';
import { IMessageRepository } from '../../domain/interface/IMessageRepository';
import { ISendMessageUseCase } from '../../domain/interface/ISendMessageUseCase';
import { INotificationRepository } from '../../domain/interface/INotificationRepository';
import { ISendNotificationUseCase } from '../../domain/interface/ISendNotificationUseCase';
import { INotificationScheduler } from '../../domain/interface/INotificationScheduler';
import { IClassRepository } from '../../domain/interface/admin/IClassRepository';
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
    private notificationScheduler: INotificationScheduler,
    private classRepository: IClassRepository
  ) {}

  getIo(): SocketIOServer {
    return this.io;
  }

  initialize() {
    this.notificationScheduler.start();

    this.io.use((socket, next) => {
      const userId = socket.handshake.query.userId as string;
      const userRole = socket.handshake.query.userRole as Role;
      if (!userId || !userRole) {
        return next(new ValidationError('Authentication error: userId and userRole required'));
      }
      socket.data.userId = userId;
      socket.data.userRole = userRole;
      next();
    });

    this.io.on('connection', (socket: Socket) => {
      console.log('User connected:', socket.id, 'userId:', socket.data.userId);

      socket.on('joinRoom', async (chatRoomId: string, callback) => {
        if (!chatRoomId) {
          socket.emit('error', new ValidationError('Invalid chatRoomId').message);
          return;
        }

        try {
          if (socket.data.userRole === Role.Student) {
            const isStudentInClass = await this.classRepository.isStudentInClass(
              socket.data.userId,
              chatRoomId
            );
            if (!isStudentInClass) {
              socket.emit('error', new ForbiddenError('You are not authorized to join this class group').message);
              return;
            }
          }
          // Teachers can join any class group (no check needed)

          socket.join(chatRoomId);
          console.log(`User ${socket.data.userId} joined room ${chatRoomId}`);
          if (callback) callback();
        } catch (error) {
          socket.emit('error', error instanceof Error ? error.message : 'Failed to join room');
        }
      });

      socket.on('loadMessages', async (chatRoomId: string) => {
        try {
          if (socket.data.userRole === Role.Student) {
            const isStudentInClass = await this.classRepository.isStudentInClass(
              socket.data.userId,
              chatRoomId
            );
            if (!isStudentInClass) {
              socket.emit('error', new ForbiddenError('You are not authorized to access this class group').message);
              return;
            }
          }

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
            message.senderId !== socket.data.userId ||
            message.senderRole !== socket.data.userRole
          ) {
            throw new UnauthorizedError('Unauthorized or missing message fields');
          }

          if (message.senderRole === Role.Student) {
            const isStudentInClass = await this.classRepository.isStudentInClass(
              message.senderId,
              message.chatRoomId
            );
            if (!isStudentInClass) {
              throw new ForbiddenError('You are not authorized to send messages to this class group');
            }
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

      socket.on('joinNotification', () => {
        socket.join(`user-${socket.data.userId}`);
        console.log(`User ${socket.data.userId} joined notification room`);
      });

      socket.on('sendNotification', async (notification: SendNotificationDTO) => {
        try {
          if (!notification.title || !notification.message || !notification.senderId || !notification.senderRole) {
            throw new ValidationError('Missing required notification fields');
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
                this.io.to(`role-${role}`).emit('notification', savedNotification);
              });
            } else if (notification.recipientType === RecipientType.Student) {
              notification.recipientIds?.forEach((userId) => {
                this.io.to(`user-${userId}`).emit('notification', savedNotification);
              });
            }
          }
          socket.emit('notification', savedNotification);
        } catch (error) {
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