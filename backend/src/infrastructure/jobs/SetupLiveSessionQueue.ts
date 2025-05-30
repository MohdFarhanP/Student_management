import { ILiveSessionRepository } from '../../domain/repositories/ILiveSessionRepository';
import { IVideoService } from '../../application/services/IVideoService';
import { Queue, Worker } from 'bullmq';
import { ILiveSession } from '../../domain/types/interfaces';
import { Server as SocketIOServer } from 'socket.io';
import { SessionStatus } from '../../domain/types/enums';

export const setupLiveSessionQueue = (
  io: SocketIOServer,
  liveSessionRepository: ILiveSessionRepository,
  videoService: IVideoService,
  sessionQueue: Queue
) => {
  const worker = new Worker(
    'live-session',
    async (job) => {
      const session = job.data as ILiveSession;
      console.log(
        `Starting live session ${session.id} at ${new Date().toISOString()}`
      );

      // Update session status to Ongoing
      await liveSessionRepository.updateStatus(
        session.id,
        SessionStatus.Ongoing
      );

      // Start the video session
      if (session.roomId) {
        await videoService.startSession(session.roomId);
      }

      // Notify participants via Socket.IO
      io.emit('live-session-start', {
        sessionId: session.id,
        roomId: session.roomId,
        title: session.title,
        scheduledAt: session.scheduledAt, // Include scheduledAt
      });

      console.log(`Live session ${session.id} started`);
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
    console.error('Live session worker error:', error);
  });

  worker.on('completed', (job) => {
    console.log(`Live session job ${job.id} completed`);
  });

  worker.on('failed', (job, error) => {
    console.error(`Live session job ${job.id} failed with error:`, error);
  });

  return worker;
};
