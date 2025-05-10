import { Server as SocketIOServer, Socket } from 'socket.io';
import { ISocketServer } from '../../domain/interface/ISocketServer';
import { IMessageRepository } from '../../domain/interface/IMessageRepository';
import { ISendMessageUseCase } from '../../domain/interface/ISendMessageUseCase';
import { INotificationRepository } from '../../domain/interface/INotificationRepository';
import { ISendNotificationUseCase } from '../../domain/interface/ISendNotificationUseCase';
import { IClassRepository } from '../../domain/interface/admin/IClassRepository';
import { JoinLiveSessionDTO, ScheduleLiveSessionDTO, SendMessageDTO, SendNotificationDTO, UserInfo } from '../../domain/types/interfaces';
import { ValidationError, UnauthorizedError, ForbiddenError } from '../../domain/errors';
import { Role, RecipientType, SessionStatus } from '../../domain/types/enums';
import { IScheduleLiveSessionUseCase } from '../../domain/interface/IScheduleLiveSessionUseCase';
import { IJoinLiveSessionUseCase } from '../../domain/interface/IJoinLiveSessionUseCase';
import { ILiveSessionRepository } from '../../domain/interface/ILiveSessionRepository';
import { IVideoService } from '../../domain/interface/IVideoService';

export class SocketServer implements ISocketServer {
  constructor(
    private io: SocketIOServer,
    private messageRepository: IMessageRepository,
    private sendMessageUseCase: ISendMessageUseCase,
    private notificationRepository: INotificationRepository,
    private sendNotificationUseCase: ISendNotificationUseCase,
    private classRepository: IClassRepository,
    private scheduleLiveSessionUseCase: IScheduleLiveSessionUseCase,
    private joinLiveSessionUseCase: IJoinLiveSessionUseCase,
    private liveSessionRepository: ILiveSessionRepository,
    private videoService: IVideoService // Add IVideoService dependency
  ) {
    console.log('SocketServer constructor called');
    console.log('SocketServer initialized with sendNotificationUseCase:', !!sendNotificationUseCase);
    console.log('SocketServer initialized with videoService:', !!videoService);
  }

  initialize() {
    console.log('SocketServer initializing...');

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
      console.log(`User connected: ${socket.data.userId}`);

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

          socket.join(chatRoomId);
          if (callback) callback({ success: true });
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
          if (notification.recipientType !== RecipientType.Global && (!notification.recipientIds || !notification.recipientIds.length)) {
            throw new ValidationError('Recipient IDs required for non-global notifications');
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
            await this.notificationRepository.markAsSent(savedNotification.id);
          }
          socket.emit('notificationScheduled', savedNotification);
        } catch (error) {
          console.error('Error sending notification:', error);
          socket.emit('error', error instanceof Error ? error.message : 'Failed to send notification');
        }
      });

      // Schedule a live session
      socket.on('schedule-live-session', async (dto: ScheduleLiveSessionDTO & { sessionId: string }) => {
        try {
          if (!dto.sessionId || !dto.title || !dto.teacherId || !dto.studentIds || !dto.scheduledAt) {
            throw new ValidationError('Missing required fields for scheduling live session');
          }
          if (dto.teacherId !== socket.data.userId) {
            throw new UnauthorizedError('Unauthorized: Teacher ID does not match socket user');
          }
          if (socket.data.userRole !== Role.Teacher) {
            throw new ForbiddenError('Unauthorized: Only teachers can schedule live sessions');
          }

          const session = await this.scheduleLiveSessionUseCase.execute(dto);

          const participants: UserInfo[] = [
            { id: dto.teacherId, email: `user-${dto.teacherId}@example.com`, role: 'Teacher' }, // Ideally fetch email from a user service
            ...dto.studentIds.map((studentId: string) => ({
              id: studentId,
              email: `user-${studentId}@example.com`,
              role: 'Student',
            })),
          ];

          await this.liveSessionRepository.update(dto.sessionId, { participants });

          socket.emit('live-session-scheduled', {
            sessionId: session.id,
            title: session.title,
            scheduledAt: session.scheduledAt,
          });

          // If the session starts immediately, notify students
          if (new Date(dto.scheduledAt).getTime() <= Date.now()) {

            //   socket.emit('live-session-start', {
            //     sessionId: session.id,
            //     title: session.title,
            // });

            session.studentIds.forEach((studentId: string) => {
              this.io.to(`user-${studentId}`).emit('live-session-start', {
                sessionId: session.id,
                title: session.title,
              });
            });
          }
        } catch (error) {
          console.error('Error scheduling live session:', error);
          socket.emit('error', error instanceof Error ? error.message : 'Failed to schedule live session');
        }
      });

      // Join a live session
      socket.on('join-live-session', async (dto: JoinLiveSessionDTO) => {
        try {
          if (!dto.sessionId || !dto.participantId) {
            throw new ValidationError('Missing required fields for joining live session');
          }
          if (dto.participantId !== socket.data.userId) {
            throw new UnauthorizedError('Unauthorized: Participant ID does not match socket user');
          }

          const response = await this.joinLiveSessionUseCase.execute(dto);
          
          socket.emit('live-session-joined', response);

          socket.join(dto.sessionId);
          console.log(`User ${socket.data.userId} joined session room ${dto.sessionId}`);
          
          const updatedSession = await this.liveSessionRepository.findById(dto.sessionId);
          const participants: UserInfo[] = updatedSession?.participants?.map((participant: any) => ({
            id: participant.id,
            email: participant.email || `user-${participant.id}@example.com`,
            role: participant.role || 'Unknown',
          })) || [];

          this.io.to(dto.sessionId).emit('participants-updated', { participants });
        } catch (error) {
          console.error('Error joining live session:', error);
          socket.emit('error', error instanceof Error ? error.message : 'Failed to join live session');
        }
      });

        socket.on('join-session-room', (sessionId: string) => {
        socket.join(sessionId);
        console.log(`User ${socket.data.userId} joined session room ${sessionId}`);
      });

    socket.on('leave-live-session', async ({ sessionId, participantId }: { sessionId: string; participantId: string }) => {
      try {
        if (!sessionId || !participantId) {
          throw new ValidationError('Missing required fields for leaving live session');
        }
        if (participantId !== socket.data.userId) {
          throw new UnauthorizedError('Unauthorized: Participant ID does not match socket user');
        }

        const session = await this.liveSessionRepository.findById(sessionId);
        if (!session) {
          throw new ValidationError('Live session not found');
        }

        // Remove the user from the participants list
        const updatedParticipants = (session.participants || []).filter((p: UserInfo) => p.id !== participantId);
        await this.liveSessionRepository.update(sessionId, { participants: updatedParticipants });

        // Broadcast the updated participants list to all users in the session
        socket.to(sessionId).emit('participants-updated', { participants: updatedParticipants });

        // Leave the session room
        socket.leave(sessionId);
      } catch (error) {
        console.error('Error leaving live session:', error);
        socket.emit('error', error instanceof Error ? error.message : 'Failed to leave live session');
      }
    });

      // End a live session
      socket.on('end-live-session', async ({ sessionId }: { sessionId: string }) => {
        try {
          if (!sessionId) {
            throw new ValidationError('Missing sessionId for ending live session');
          }
          if (socket.data.userRole !== Role.Teacher) {
            throw new ForbiddenError('Unauthorized: Only teachers can end live sessions');
          }

          const session = await this.liveSessionRepository.findById(sessionId);
          if (!session) {
            throw new ValidationError('Live session not found');
          }
          if (session.teacherId !== socket.data.userId) {
            throw new UnauthorizedError('Unauthorized: Only the session host can end the session');
          }

          // Update session status to Ended
          await this.liveSessionRepository.update(sessionId, { status: SessionStatus.Ended, participants: [] });
          // Notify all participants
          this.io.emit('live-session-ended', { sessionId });
        } catch (error) {
          console.error('Error ending live session:', error);
          socket.emit('error', error instanceof Error ? error.message : 'Failed to end live session');
        }
      });

      // Renew token handler
      socket.on('renew-token', async ({ sessionId, participantId }, callback) => {
        try {
          console.log(`Renewing token for session ${sessionId}, participant ${participantId}`);
          const session = await this.liveSessionRepository.findById(sessionId);
          if (!session || !session.roomId) {
            throw new Error('Session or room ID not found');
          }
          const token = this.videoService.generateToken(session.roomId, participantId);
          console.log('Token renewed successfully:', token);
          callback({ token });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error('Error renewing token:', errorMessage);
          socket.emit('error', { message: errorMessage });
          callback({ error: errorMessage });
        }
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
  }
}