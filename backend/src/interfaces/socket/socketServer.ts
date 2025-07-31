import { Server as SocketIOServer, Socket } from 'socket.io';
import { ISocketServer } from '../../application/services/ISocketServer';
import { IMessageRepository } from '../../domain/repositories/IMessageRepository';
import { ISendMessageUseCase } from '../../domain/useCase/ISendMessageUseCase';
import { INotificationRepository } from '../../domain/repositories/INotificationRepository';
import { ISendNotificationUseCase } from '../../domain/useCase/ISendNotificationUseCase';
import { IClassRepository } from '../../domain/repositories/IClassRepository';
import { UserInfo } from '../../domain/types/interfaces';
import {
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
} from '../../domain/errors';
import {
  Role,
  RecipientType,
  SessionStatus,
  LeaveStatus,
} from '../../domain/types/enums';
import { IScheduleLiveSessionUseCase } from '../../domain/useCase/IScheduleLiveSessionUseCase';
import { IJoinLiveSessionUseCase } from '../../domain/useCase/IJoinLiveSessionUseCase';
import { ILiveSessionRepository } from '../../domain/repositories/ILiveSessionRepository';
import { IVideoService } from '../../application/services/IVideoService';
import { IApplyForLeaveUseCase } from '../../domain/useCase/IApplyForLeaveUseCase';
import { IViewLeaveHistoryUseCase } from '../../domain/useCase/IViewLeaveHistoryUseCase';
import { IApproveRejectLeaveUseCase } from '../../domain/useCase/IApproveRejectLeaveUseCase';
import {
  ApproveRejectLeaveDTO,
  ViewLeaveHistoryDTO,
  ApplyForLeaveDTO,
} from '../../application/dtos/leaveDtos';
import { IGetAdminDashboardStatsUseCase } from '../../domain/useCase/IGetAdminDashboardStatsUseCase';
import { ITeacherRepository } from '../../domain/repositories/ITeacherRepository';
import { IStudentRepository } from '../../domain/repositories/IStudentRepository';
import { ITrackSessionDurationUseCase } from '../../domain/useCase/ITrackSessionDurationUseCase';
import { SendMessageDTO } from '../../application/dtos/messageDtos';
import { SendNotificationDTO } from '../../application/dtos/notificationDtos';
import {
  JoinLiveSessionDTO,
  ScheduleLiveSessionDTO,
  TrackSessionDurationDTO,
} from '../../application/dtos/liveSessionDtos';
import logger from '../../logger';

interface AdminDashboardResponse {
  success: boolean;
  stats?: {
    totalStudents: number;
    totalTeachers: number;
    totalClasses: number;
  };
  error?: string;
}

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
    private videoService: IVideoService,
    private applyForLeaveUseCase: IApplyForLeaveUseCase,
    private viewLeaveHistoryUseCase: IViewLeaveHistoryUseCase,
    private approveRejectLeaveUseCase: IApproveRejectLeaveUseCase,
    private getAdminDashboardStatsUseCase: IGetAdminDashboardStatsUseCase,
    private teacherRepository: ITeacherRepository,
    private studentRepository: IStudentRepository,
    private trackSessionDurationUseCase: ITrackSessionDurationUseCase
  ) {}

  initialize() {
    logger.info('SocketServer initializing...');

    this.io.use((socket, next) => {
      let userId: string | undefined;
      let userRole: Role | undefined;

      // Check auth first (preferred)
      if (
        socket.handshake.auth &&
        socket.handshake.auth.userId &&
        socket.handshake.auth.userRole
      ) {
        userId = socket.handshake.auth.userId as string;
        userRole = socket.handshake.auth.userRole as Role;
      }
      // Fallback to query (temporary for compatibility)
      else if (
        socket.handshake.query.userId &&
        socket.handshake.query.userRole
      ) {
        userId = socket.handshake.query.userId as string;
        userRole = socket.handshake.query.userRole as Role;
        logger.warn(
          `Socket authenticated via query for user ${userId} with role ${userRole} (deprecated, use auth)`
        );
      }

      if (!userId || !userRole) {
        logger.error('Authentication error: userId and userRole required');
        return next(
          new ValidationError(
            'Authentication error: userId and userRole required'
          )
        );
      }

      socket.data.userId = userId;
      socket.data.userRole = userRole;
      next();
    });

    this.io.on('connection', (socket: Socket) => {

      socket.on('joinRoom', async (chatRoomId: string, callback) => {
        if (!chatRoomId) {
          socket.emit(
            'error',
            new ValidationError('Invalid chatRoomId').message
          );
          return;
        }

        try {
          if (socket.data.userRole === Role.Student) {
            const isStudentInClass =
              await this.classRepository.isStudentInClass(
                socket.data.userId,
                chatRoomId
              );
            if (!isStudentInClass) {
              socket.emit(
                'error',
                new ForbiddenError(
                  'You are not authorized to join this class group'
                ).message
              );
              return;
            }
          }

          socket.join(chatRoomId);
          if (callback) callback({ success: true });
        } catch (error) {
          socket.emit(
            'error',
            error instanceof Error ? error.message : 'Failed to join room'
          );
        }
      });

      socket.on('loadMessages', async (chatRoomId: string) => {
        try {
          if (socket.data.userRole === Role.Student) {
            const isStudentInClass =
              await this.classRepository.isStudentInClass(
                socket.data.userId,
                chatRoomId
              );
            if (!isStudentInClass) {
              socket.emit(
                'error',
                new ForbiddenError(
                  'You are not authorized to access this class group'
                ).message
              );
              return;
            }
          }

          const messages =
            await this.messageRepository.findByChatRoomId(chatRoomId);
          socket.emit('initialMessages', messages);
        } catch (error) {
          socket.emit(
            'error',
            error instanceof Error ? error.message : 'Failed to load messages'
          );
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
            throw new UnauthorizedError(
              'Unauthorized or missing message fields'
            );
          }

          if (message.senderRole === Role.Student) {
            const isStudentInClass =
              await this.classRepository.isStudentInClass(
                message.senderId,
                message.chatRoomId
              );
            if (!isStudentInClass) {
              throw new ForbiddenError(
                'You are not authorized to send messages to this class group'
              );
            }
          }

          const savedMessage = await this.sendMessageUseCase.execute(message);
          this.io.to(message.chatRoomId).emit('message', savedMessage);
        } catch (error) {
          logger.error('Error sending message:', error);
          socket.emit(
            'error',
            error instanceof Error ? error.message : 'An unknown error occurred'
          );
        }
      });

      socket.on('joinNotification', () => {
        socket.join(`user-${socket.data.userId}`);
        socket.join(`role-${socket.data.userRole}`);
      });

      socket.on(
        'sendNotification',
        async (notification: SendNotificationDTO) => {
          try {
            if (
              !notification.title ||
              !notification.message ||
              !notification.senderId ||
              !notification.senderRole
            ) {
              throw new ValidationError('Missing required notification fields');
            }
            if (notification.senderId !== socket.data.userId) {
              throw new UnauthorizedError(
                'Unauthorized: Sender ID does not match socket user'
              );
            }
            if (![Role.Admin, Role.Teacher].includes(notification.senderRole)) {
              throw new ForbiddenError('Unauthorized: Invalid sender role');
            }
            if (
              notification.recipientType !== RecipientType.Global &&
              (!notification.recipientIds || !notification.recipientIds.length)
            ) {
              throw new ValidationError(
                'Recipient IDs required for non-global notifications'
              );
            }

            const savedNotification =
              await this.sendNotificationUseCase.execute(notification);
            const now = new Date();
            if (
              !notification.scheduledAt ||
              new Date(notification.scheduledAt) <= now
            ) {
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
              await this.notificationRepository.markAsSent(
                savedNotification.id
              );
            }
            socket.emit('notificationScheduled', savedNotification);
          } catch (error) {
            logger.error('Error sending notification:', error);
            socket.emit(
              'error',
              error instanceof Error
                ? error.message
                : 'Failed to send notification'
            );
          }
        }
      );

      socket.on(
        'apply-for-leave',
        async (
          dto: ApplyForLeaveDTO,
          callback: (response: { success: boolean; error?: string }) => void
        ) => {
          try {
            if (!dto.studentId || !dto.date || !dto.reason) {
              throw new ValidationError(
                'Missing required fields: studentId, date, reason'
              );
            }
            if (dto.studentId !== socket.data.userId) {
              throw new UnauthorizedError(
                'Unauthorized: Student ID does not match socket user'
              );
            }
            if (socket.data.userRole !== Role.Student) {
              throw new UnauthorizedError('Only students can apply for leaves');
            }

            const leave = await this.applyForLeaveUseCase.execute(dto);
            socket.emit('leave-applied', { leave }); // Emit leave object in a payload
            callback({ success: true });
          } catch (error) {
            logger.error(`[DEBUG] Error applying for leave:`, error);
            const message =
              error instanceof Error
                ? error.message
                : 'Failed to apply for leave';
            socket.emit('error', {
              message,
              context: { studentId: dto?.studentId, date: dto?.date },
            });
            callback({ success: false, error: message });
          }
        }
      );

      socket.on(
        'view-leave-history',
        async (
          dto: ViewLeaveHistoryDTO,
          callback: (response: {
            success: boolean;
            leaves?: any[];
            error?: string;
          }) => void
        ) => {
          try {
            if (!dto.studentId && socket.data.userRole !== Role.Teacher) {
              throw new UnauthorizedError(
                'Only teachers can view pending leave requests'
              );
            }
            if (dto.studentId && dto.studentId !== socket.data.userId) {
              throw new UnauthorizedError(
                'Unauthorized: Student ID does not match socket user'
              );
            }
            if (dto.studentId && socket.data.userRole !== Role.Student) {
              throw new UnauthorizedError(
                'Only students can view their leave history'
              );
            }

            const leaves = await this.viewLeaveHistoryUseCase.execute({
              studentId: dto.studentId || '',
              userId: socket.data.userId,
            });
            callback({ success: true, leaves });
          } catch (error) {
            logger.error(`[DEBUG] Error viewing leave history:`, error);
            const message =
              error instanceof Error
                ? error.message
                : 'Failed to view leave history';
            socket.emit('error', {
              message,
              context: { studentId: dto.studentId, userId: socket.data.userId },
            });
            callback({ success: false, error: message });
          }
        }
      );

      socket.on(
        'approve-reject-leave',
        async (
          dto: ApproveRejectLeaveDTO,
          callback: (response: { success: boolean; error?: string }) => void
        ) => {
          try {
            if (!dto.leaveId || !dto.teacherId || !dto.status) {
              throw new ValidationError(
                'Missing required fields: leaveId, teacherId, status'
              );
            }
            if (dto.teacherId !== socket.data.userId) {
              throw new UnauthorizedError(
                'Unauthorized: Teacher ID does not match socket user'
              );
            }
            if (socket.data.userRole !== Role.Teacher) {
              throw new UnauthorizedError(
                'Only teachers can approve or reject leaves'
              );
            }


            const leave = await this.approveRejectLeaveUseCase.execute(dto);
            socket.emit('leave-updated', { leave }); // Emit leave object in a payload
            this.io
              .to(`user-${leave.studentId}`)
              .emit('leave-updated', { leave });
            callback({ success: true });
          } catch (error) {
            const message =
              error instanceof Error
                ? error.message
                : 'Failed to approve/reject leave';
            socket.emit('error', {
              message,
              context: { leaveId: dto.leaveId, teacherId: dto.teacherId },
            });
            callback({ success: false, error: message });
          }
        }
      );

      socket.on(
        'schedule-live-session',
        async (dto: ScheduleLiveSessionDTO & { sessionId: string }) => {
          try {
            if (
              !dto.sessionId ||
              !dto.title ||
              !dto.teacherId ||
              !dto.studentIds ||
              !dto.scheduledAt
            ) {
              throw new ValidationError(
                'Missing required fields for scheduling live session'
              );
            }
            if (dto.teacherId !== socket.data.userId) {
              throw new UnauthorizedError(
                'Unauthorized: Teacher ID does not match socket user'
              );
            }
            if (socket.data.userRole !== Role.Teacher) {
              throw new ForbiddenError(
                'Unauthorized: Only teachers can schedule live sessions'
              );
            }

            const session = await this.scheduleLiveSessionUseCase.execute(dto);

            const userData = await this.teacherRepository.getById(
              dto.teacherId
            );

            const students = await this.studentRepository.findManyByIds(
              dto.studentIds
            );

            const studentUsers: UserInfo[] = students.map((student) => ({
              id: student.id.toString(),
              email: student.email,
              name: student.name,
              role: 'Student',
            }));

            const participants: UserInfo[] = [
              {
                id: dto.teacherId,
                email: userData.email,
                name: userData.name,
                role: 'Teacher',
              },
              ...studentUsers,
            ];

            await this.liveSessionRepository.update(dto.sessionId, {
              participants,
            });

            // socket.emit('live-session-scheduled', {
            //   sessionId: session.id,
            //   title: session.title,
            //   scheduledAt: session.scheduledAt,
            // });

            if (new Date(dto.scheduledAt).getTime() <= Date.now()) {
              session.studentIds.forEach((studentId: string) => {
                this.io.to(`user-${studentId}`).emit('live-session-start', {
                  sessionId: session.id,
                  title: session.title,
                });
              });
            }
          } catch (error) {
            logger.error('Error scheduling live session:', error);
            socket.emit(
              'error',
              error instanceof Error
                ? error.message
                : 'Failed to schedule live session'
            );
          }
        }
      );

      socket.on('join-live-session', async (dto: JoinLiveSessionDTO) => {
        try {
          if (!dto.sessionId || !dto.participantId) {
            throw new ValidationError(
              'Missing required fields for joining live session'
            );
          }
          if (dto.participantId !== socket.data.userId) {
            throw new UnauthorizedError(
              'Unauthorized: Participant ID does not match socket user'
            );
          }

          const response = await this.joinLiveSessionUseCase.execute(dto);

          socket.emit('live-session-joined', response);

          socket.join(dto.sessionId);

          const updatedSession = await this.liveSessionRepository.findById(
            dto.sessionId
          );
          const participants: UserInfo[] =
            updatedSession?.participants?.map((participant: any) => ({
              id: participant.id,
              name: participant.name,
              email: participant.email || `user-${participant.id}@example.com`,
              role: participant.role || 'Unknown',
            })) || [];

          this.io
            .to(dto.sessionId)
            .emit('participants-updated', { participants });
        } catch (error) {
          logger.error('Error joining live session:', error);
          socket.emit(
            'error',
            error instanceof Error
              ? error.message
              : 'Failed to join live session'
          );
        }
      });

      socket.on('join-session-room', (sessionId: string) => {
        socket.join(sessionId);
      });

      socket.on(
        'leave-live-session',
        async ({
          sessionId,
          participantId,
        }: {
          sessionId: string;
          participantId: string;
        }) => {
          try {
            if (!sessionId || !participantId) {
              throw new ValidationError(
                'Missing required fields for leaving live session'
              );
            }
            if (participantId !== socket.data.userId) {
              throw new UnauthorizedError(
                'Unauthorized: Participant ID does not match socket user'
              );
            }

            const session =
              await this.liveSessionRepository.findById(sessionId);
            if (!session) {
              throw new ValidationError('Live session not found');
            }

            const updatedParticipants = (session.participants || []).filter(
              (p: UserInfo) => p.id !== participantId
            );
            await this.liveSessionRepository.update(sessionId, {
              participants: updatedParticipants,
            });

            socket.to(sessionId).emit('participants-updated', {
              participants: updatedParticipants,
            });

            socket.leave(sessionId);
          } catch (error) {
            logger.error('Error leaving live session:', error);
            socket.emit(
              'error',
              error instanceof Error
                ? error.message
                : 'Failed to leave live session'
            );
          }
        }
      );

      socket.on(
        'student-session-duration',
        async (data: TrackSessionDurationDTO) => {
          try {
            await this.trackSessionDurationUseCase.execute({
              userId: data.userId,
              sessionId: data.sessionId,
              durationSeconds: data.durationSeconds,
              joinTime: new Date(data.joinTime),
              leaveTime: new Date(data.leaveTime),
            });

          } catch (error) {

            socket.emit('error', {
              message: `Failed to track session duration: ${(error as Error).message}`,
            });
          }
        }
      );

      socket.on(
        'end-live-session',
        async ({ sessionId }: { sessionId: string }) => {
          try {
            if (!sessionId) {
              throw new ValidationError(
                'Missing sessionId for ending live session'
              );
            }
            if (socket.data.userRole !== Role.Teacher) {
              throw new ForbiddenError(
                'Unauthorized: Only teachers can end live sessions'
              );
            }

            const session =
              await this.liveSessionRepository.findById(sessionId);
            if (!session) {
              throw new ValidationError('Live session not found');
            }
            if (session.teacherId !== socket.data.userId) {
              throw new UnauthorizedError(
                'Unauthorized: Only the session host can end the session'
              );
            }

            await this.liveSessionRepository.update(sessionId, {
              status: SessionStatus.Ended,
              participants: [],
            });
            this.io.emit('live-session-ended', { sessionId });
          } catch (error) {
            logger.error('Error ending live session:', error);
            socket.emit(
              'error',
              error instanceof Error
                ? error.message
                : 'Failed to end live session'
            );
          }
        }
      );

      socket.on(
        'renew-token',
        async ({ sessionId, participantId }, callback) => {
          try {
            const session =
              await this.liveSessionRepository.findById(sessionId);
            if (!session || !session.roomId) {
              throw new Error('Session or room ID not found');
            }
            const token = this.videoService.generateToken(
              session.roomId,
              participantId
            );
            logger.info('Token renewed successfully:', token);
            callback({ token });
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : 'Unknown error';
            logger.error('Error renewing token:', errorMessage);
            socket.emit('error', { message: errorMessage });
            callback({ error: errorMessage });
          }
        }
      );

      socket.on('get-admin-dashboard-stats', async (data, callback) => {
        try {
          const stats = await this.getAdminDashboardStatsUseCase.execute();
          callback({
            success: true,
            stats,
          } as AdminDashboardResponse);
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Unknown error';
          callback({
            success: false,
            error: message,
          } as AdminDashboardResponse);
        }
      });

      socket.on('disconnect', () => {

      });
    });
  }
}
