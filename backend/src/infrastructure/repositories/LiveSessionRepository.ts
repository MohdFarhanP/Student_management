import { ILiveSessionRepository } from '../../domain/repositories/ILiveSessionRepository';
import { ILiveSession } from '../../domain/types/interfaces';
import { mapToLiveSessionEntity } from '../database/mongoos/helpers/mapToLiveSessionEntity ';
import { LiveSessionModel } from '../database/mongoos/models/liveSessionModel';

export class LiveSessionRepository implements ILiveSessionRepository {
  async save(session: ILiveSession): Promise<ILiveSession> {
    const newSessionDoc = await LiveSessionModel.create(session);
    return mapToLiveSessionEntity(newSessionDoc.toObject());
  }

  async findById(sessionId: string): Promise<ILiveSession | null> {
    const doc = await LiveSessionModel.findOne({ id: sessionId }).lean().exec();
    return doc ? mapToLiveSessionEntity(doc) : null;
  }

  async findByStudentId(studentId: string): Promise<ILiveSession[]> {
    const docs = await LiveSessionModel.find({
      studentIds: studentId,
      status: 'Scheduled',
      scheduledAt: { $gte: new Date() },
    })
      .lean()
      .exec();
    return docs.map(mapToLiveSessionEntity);
  }

  async findByTeacherId(teacherId: string): Promise<ILiveSession[]> {
    const docs = await LiveSessionModel.find({
      teacherId,
      status: 'Scheduled',
      scheduledAt: { $gte: new Date() },
    })
      .lean()
      .exec();
    return docs.map(mapToLiveSessionEntity);
  }

  async findSessionByTeacherId(
    teacherId: string,
    limit: number = 5
  ): Promise<ILiveSession[]> {
    const docs = await LiveSessionModel.find({ teacherId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec();
    return docs.map(mapToLiveSessionEntity);
  }
  async updateStatus(id: string, status: string): Promise<void> {
    const session = await LiveSessionModel.findOneAndUpdate(
      { id },
      { $set: { status } },
      { new: true }
    );
    if (!session) {
      throw new Error(`Live session with id ${id} not found`);
    }
  }

  async update(id: string, updates: Partial<ILiveSession>): Promise<void> {
    const session = await LiveSessionModel.findOneAndUpdate(
      { id },
      { $set: updates },
      { new: true }
    );
    if (!session) {
      throw new Error(`Live session with id ${id} not found`);
    }
  }
}
