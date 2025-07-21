import { SessionDuration } from '../../domain/entities/sessionDuration';
import { ISessionDurationRepository } from '../../domain/repositories/ISessionDurationRepository';
import logger from '../../logger';
import { SessionDurationModel } from '../database/mongoos/models/sessionDurationModel';

export class MongoSessionDurationRepository
  implements ISessionDurationRepository
{
  async save(sessionDuration: SessionDuration): Promise<void> {
    const doc = new SessionDurationModel({
      userId: sessionDuration.userId,
      sessionId: sessionDuration.sessionId,
      durationSeconds: sessionDuration.durationSeconds,
      joinTime: sessionDuration.joinTime,
      leaveTime: sessionDuration.leaveTime,
    });
    await doc.save();
    logger.info(
      '[MongoSessionDurationRepository] Saved duration at',
      new Date().toISOString(),
      { userId: sessionDuration.userId, sessionId: sessionDuration.sessionId }
    );
  }

  async findBySessionId(sessionId: string): Promise<SessionDuration[]> {
    const docs = await SessionDurationModel.find({ sessionId }).exec();
    return docs.map(
      (doc) =>
        new SessionDuration(
          doc.userId,
          doc.sessionId,
          doc.durationSeconds,
          doc.joinTime,
          doc.leaveTime
        )
    );
  }
}
