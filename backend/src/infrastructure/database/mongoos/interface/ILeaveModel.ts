import { Document } from 'mongoose';

export interface ILeaveModel extends Document {
  studentId: string;
  date: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  updatedAt: string;
}
