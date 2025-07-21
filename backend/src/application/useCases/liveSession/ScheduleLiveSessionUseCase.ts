import { ILiveSessionRepository } from '../../../domain/repositories/ILiveSessionRepository';
import { IVideoService } from '../../services/IVideoService';
import { IScheduleLiveSessionUseCase } from '../../../domain/useCase/IScheduleLiveSessionUseCase';
import { ILiveSession } from '../../../domain/types/interfaces';
import { SessionStatus } from '../../../domain/types/enums';
import { Queue } from 'bullmq';
import { ValidationError } from '../../../domain/errors';
import { ScheduleLiveSessionDTO } from '../../dtos/liveSessionDtos';
import logger from '../../../logger';

export class ScheduleLiveSession implements IScheduleLiveSessionUseCase {
  constructor(
    private liveSessionRepository: ILiveSessionRepository,
    private videoService: IVideoService,
    private sessionQueue: Queue
  ) {}

  async execute(
    dto: ScheduleLiveSessionDTO & { sessionId: string }
  ): Promise<ILiveSession> {
    // Validate input
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
    const scheduledTime = new Date(dto.scheduledAt);
    const now = new Date();
    const bufferTime = 5000; // 5 seconds buffer
    if (scheduledTime < new Date(now.getTime() - bufferTime)) {
      throw new ValidationError(
        'Scheduled time cannot be more than 5 seconds in the past'
      );
    }

    // If scheduledAt is within the buffer, treat it as immediate
    let effectiveScheduledAt: Date;
    if (scheduledTime <= now) {
      effectiveScheduledAt = now; // Keep as Date object
    } else {
      effectiveScheduledAt = scheduledTime;
    }

    // Generate a unique room ID for the video call
    const roomId = this.videoService.generateRoomId();

    // Create live session entity
    const session: ILiveSession = {
      id: dto.sessionId,
      title: dto.title,
      classId: dto.classId,
      teacherId: dto.teacherId,
      studentIds: dto.studentIds,
      scheduledAt: effectiveScheduledAt,
      status: SessionStatus.Scheduled,
      roomId,
      participants: [],
    };

    const savedSession = await this.liveSessionRepository.save(session);

    // Schedule the session start using BullMQ
    const delay = effectiveScheduledAt.getTime() - Date.now();
    logger.info(
      `Scheduling live session ${savedSession.id} with delay ${delay}ms`
    );
    await this.sessionQueue.add('live-session', savedSession, {
      delay: delay < 0 ? 0 : delay,
    });

    return savedSession;
  }
}
