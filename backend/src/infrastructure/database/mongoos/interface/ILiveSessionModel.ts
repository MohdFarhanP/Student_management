import { Document } from 'mongoose';

export interface ILiveSessionModel extends Document {
  id: string;
  title: string;
  classId: string;
  teacherId: string;
  studentIds: string[];
  scheduledAt: Date;
  status: 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED' | 'ENDED';
  roomId?: string;
  token?: string;
  participants?: {
    id: string;
    email: string;
    name: string;
    role: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
