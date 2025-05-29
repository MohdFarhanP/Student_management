import { Schema } from 'mongoose';
import { ILiveSessionModel } from '../interface/ILiveSessionModel';

export const LiveSessionSchema = new Schema<ILiveSessionModel>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    classId: { type: String },
    teacherId: { type: String, required: true },
    studentIds: { type: [String], required: true },
    scheduledAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ['SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED', 'ENDED'],
      default: 'SCHEDULED',
    },
    participants: [
      {
        id: { type: String, required: true },
        email: { type: String },
        name: { type: String },
        role: { type: String },
      },
    ],
    roomId: { type: String },
    token: { type: String },
  },
  { timestamps: true }
);
