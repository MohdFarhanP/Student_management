import mongoose, { Model, Document } from 'mongoose';
import { LeaveStatus } from '../../../domain/types/enums';

interface ILeaveDocument extends Document {
  studentId: string;
  date: string;
  reason: string;
  status: LeaveStatus;
  createdAt: string;
  updatedAt: string;
}

const leaveSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  date: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: Object.values(LeaveStatus), default: LeaveStatus.Pending },
  createdAt: { type: String, default: () => new Date().toISOString() },
  updatedAt: { type: String, default: () => new Date().toISOString() },
});

export const LeaveModel: Model<ILeaveDocument> = mongoose.model<ILeaveDocument>('Leave', leaveSchema);
