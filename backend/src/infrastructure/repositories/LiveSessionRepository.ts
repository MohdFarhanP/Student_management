import { LiveSession } from '../../domain/entities/Livesession';
import { ILiveSessionRepository } from '../../domain/interface/ILiveSessionRepository';
import { ILiveSession } from '../../domain/types/interfaces';
import { LiveSessionModel } from '../database/models/liveSessionModel';

export class LiveSessionRepository implements ILiveSessionRepository {
  async save(session: ILiveSession): Promise<ILiveSession> {
    const newSession = await LiveSessionModel.create(session);
    return newSession.toObject();
  }

  async findById(sessionId: string): Promise<ILiveSession | null> {
      const doc = await LiveSessionModel.findOne({ id: sessionId }).lean().exec();
      if (!doc) return null;
      return new LiveSession(
        doc.id,
        doc.title,
        doc.classId,
        doc.teacherId,
        doc.studentIds,
        doc.scheduledAt,
        doc.status,
        doc.roomId,
        doc.token,
        doc.participants,
        doc.createdAt,
        doc.updatedAt
      );
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

  async findByStudentId(studentId: string): Promise<ILiveSession[]> {
    const docs = await LiveSessionModel.find({
      studentIds: studentId,
      status: 'Scheduled',
      scheduledAt: { $gte: new Date() },
    }).lean()    .exec();
    return docs.map(
      (doc) =>
        new LiveSession(
          doc.id,
          doc.title,
          doc.classId,
          doc.teacherId,
          doc.studentIds,
          doc.scheduledAt,
          doc.status,
          doc.roomId,
          doc.token,
          doc.participants,
          doc.createdAt,
          doc.updatedAt
        )
    );
  }


  async findByTeacherId(teacherId: string): Promise<ILiveSession[]> {
    const docs = await LiveSessionModel.find({
      teacherId,
      status: 'Scheduled',
      scheduledAt: { $gte: new Date() },
    }).lean()
    .exec();
    return docs.map(
      (doc) =>
        new LiveSession(
          doc.id,
          doc.title,
          doc.classId,
          doc.teacherId,
          doc.studentIds,
          doc.scheduledAt,
          doc.status,
          doc.roomId,
          doc.token,
          doc.participants,
          doc.createdAt,
          doc.updatedAt
        )
    );
  }

  async findSessionByTeacherId(teacherId: string, limit: number = 5): Promise<ILiveSession[]> {
    const docs = await LiveSessionModel.find({ teacherId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec();
    return docs.map(
      (doc) =>
        new LiveSession(
          doc.id,
          doc.title,
          doc.classId,
          doc.teacherId,
          doc.studentIds,
          doc.scheduledAt,
          doc.status,
          doc.roomId,
          doc.token,
          doc.participants,
          doc.createdAt,
          doc.updatedAt
        )
    );
  }
}