import { Document, Types } from 'mongoose';

export interface IAttendanceModel extends Document {
  classId: Types.ObjectId;
  studentId: Types.ObjectId;
  date: Date;
  period: number;
  status: 'present' | 'absent';
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  createdBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
