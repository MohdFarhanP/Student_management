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
  ) {
    console.log('SocketServer constructor called'); // Add this log
  }

  

  initialize() {
    console.log('SocketServer initialized');

    this.io.use((socket, next) => {
      const userId = socket.handshake.query.userId as string;
      const userRole = socket.handshake.query.userRole as Role;
      console.log('Socket middleware - userId:', userId, 'userRole:', userRole);
      if (!userId || !userRole) {
        console.error('Authentication error: userId and userRole required');
        return next(new ValidationError('Authentication error: userId and userRole required'));
      }
      socket.data.userId = userId;
      socket.data.userRole = userRole;
      next();
    });


    if (this.notificationScheduler) {
      this.notificationScheduler.start();
    }

    this.io.on('connection', (socket: Socket) => {
      console.log('User connected:', socket.id, 'userId:', socket.data.userId, 'userRole:', socket.data.userRole);

      socket.on('joinRoom', async (chatRoomId: string, callback) => {
        console.log('joinRoom event received:', chatRoomId);
        if (!chatRoomId) {
          console.error('Invalid chatRoomId:', chatRoomId);
          socket.emit('error', new ValidationError('Invalid chatRoomId').message);
          return;
        }

        try {
          if (socket.data.userRole === Role.Student) {
            const isStudentInClass = await this.classRepository.isStudentInClass(
              socket.data.userId,
              chatRoomId
            );
            console.log("isStudentInClass in sockent server.ts",isStudentInClass)
            if (!isStudentInClass) {
              console.error('Student not authorized to join room:', chatRoomId);
              socket.emit('error', new ForbiddenError('You are not authorized to join this class group').message);
              return;
            }
          }

          socket.join(chatRoomId);
          console.log(`User ${socket.data.userId} joined room ${chatRoomId}`);
          if (callback) callback({ success: true });
        } catch (error) {
          console.error('Error joining room:', error);
          socket.emit('error', error instanceof Error ? error.message : 'Failed to join room');
        }
      });

      socket.on('loadMessages', async (chatRoomId: string) => {
        console.log('loadMessages event received:', chatRoomId);
        try {
          if (socket.data.userRole === Role.Student) {
            const isStudentInClass = await this.classRepository.isStudentInClass(
              socket.data.userId,
              chatRoomId
            );
            if (!isStudentInClass) {
              console.error('Student not authorized to access room:', chatRoomId);
              socket.emit('error', new ForbiddenError('You are not authorized to access this class group').message);
              return;
            }
          }

          const messages = await this.messageRepository.findByChatRoomId(chatRoomId);
          console.log(`Loaded ${messages.length} messages for room ${chatRoomId}`);
          socket.emit('initialMessages', messages);
        } catch (error) {
          console.error('Error loading messages:', error);
          socket.emit('error', error instanceof Error ? error.message : 'Failed to load messages');
        }
      });

      socket.on('sendMessage', async (message: SendMessageDTO) => {
        console.log('sendMessage event received:', message);
        try {
          if (
            !message.chatRoomId ||
            !message.senderId ||
            !message.senderRole ||
            message.senderId !== socket.data.userId ||
            message.senderRole !== socket.data.userRole
          ) {
            console.error('Unauthorized or invalid message:', message);
            throw new UnauthorizedError('Unauthorized or missing message fields');
          }

          if (message.senderRole === Role.Student) {
            const isStudentInClass = await this.classRepository.isStudentInClass(
              message.senderId,
              message.chatRoomId
            );
            if (!isStudentInClass) {
              console.error('Student not authorized to send message to room:', message.chatRoomId);
              throw new ForbiddenError('You are not authorized to send messages to this class group');
            }
          }

          const savedMessage = await this.sendMessageUseCase.execute(message);
          console.log('Message saved and broadcasted:', savedMessage);
          this.io.to(message.chatRoomId).emit('message', savedMessage);
        } catch (error) {
          console.error('Error sending message:', error);
          socket.emit(
            'error',
            error instanceof Error ? error.message : 'An unknown error occurred'
          );
        }
      });

      socket.on('joinNotification', () => {
        console.log('joinNotification event received');
        socket.join(`user-${socket.data.userId}`);
        console.log(`User ${socket.data.userId} joined notification room`);
      });

      socket.on('sendNotification', async (notification: SendNotificationDTO) => {
        console.log('sendNotification event received:', notification);
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
          console.error('Error sending notification:', error);
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