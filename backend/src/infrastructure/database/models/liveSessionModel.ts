import mongoose, { Schema } from 'mongoose';
import { ILiveSession } from '../../../domain/types/interfaces';
import { SessionStatus } from '../../../domain/types/enums';

const LiveSessionSchema = new Schema<ILiveSession>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    teacherId: { type: String, required: true },
    studentIds: { type: [String], required: true },
    scheduledAt: { type: Date, required: true },
    status: { 
      type: String, 
      enum: Object.values(SessionStatus),
      default: SessionStatus.Scheduled,
    },
    roomId: { type: String },
    token: { type: String },
  },
  { timestamps: true }
);

export const LiveSessionModel = mongoose.model<ILiveSession>('LiveSession', LiveSessionSchema);