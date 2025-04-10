import { Types } from 'mongoose';

export interface IAttendance {
  classId: Types.ObjectId;
  studentId: Types.ObjectId;
  date: Date;
  period: number;
  status: 'present' | 'absent';
  createdBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
