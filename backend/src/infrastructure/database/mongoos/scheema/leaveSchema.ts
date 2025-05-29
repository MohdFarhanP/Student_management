import mongoose, { Model } from 'mongoose';
import { ILeaveModel } from '../interface/ILeaveModel';

export const leaveSchema = new mongoose.Schema<ILeaveModel>({
  studentId: { type: String, required: true },
  date: { type: String, required: true },
  reason: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  createdAt: {
    type: String,
    default: () => new Date().toISOString(),
  },
  updatedAt: {
    type: String,
    default: () => new Date().toISOString(),
  },
});
