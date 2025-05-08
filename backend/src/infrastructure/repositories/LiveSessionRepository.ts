import { ILiveSessionRepository } from '../../domain/interface/ILiveSessionRepository';
import { ILiveSession } from '../../domain/types/interfaces';
import { LiveSessionModel } from '../database/models/liveSessionModel';

export class LiveSessionRepository implements ILiveSessionRepository {
  async save(session: ILiveSession): Promise<ILiveSession> {
    const newSession = await LiveSessionModel.create(session);
    return newSession.toObject();
  }

  async findById(id: string): Promise<ILiveSession | null> {
    const session = await LiveSessionModel.findOne({ id }).lean();
    return session || null;
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
}