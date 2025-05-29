import { Document } from 'mongoose';

export interface ISessionDurationModel extends Document {
  userId: string;
  sessionId: string;
  durationSeconds: number;
  joinTime: Date;
  leaveTime: Date;
}
