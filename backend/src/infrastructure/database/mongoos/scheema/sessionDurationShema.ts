import { Schema } from 'mongoose';
import { ISessionDurationModel } from '../interface/ISessionDurationDocument';

export const SessionDurationShema = new Schema<ISessionDurationModel>({
  userId: { type: String },
  sessionId: { type: String },
  durationSeconds: { type: Number },
  joinTime: { type: Date },
  leaveTime: { type: Date },
});
