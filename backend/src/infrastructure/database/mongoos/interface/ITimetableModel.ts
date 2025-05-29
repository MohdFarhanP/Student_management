import { Document, Types } from 'mongoose';

export interface ITimetableSlot {
  period: number;
  teacherId?: Types.ObjectId | null;
  teacherName?: string;
  subject?: string | null;
}

export interface ITimetableSchedule {
  Monday: ITimetableSlot[];
  Tuesday: ITimetableSlot[];
  Wednesday: ITimetableSlot[];
  Thursday: ITimetableSlot[];
  Friday: ITimetableSlot[];
}

export interface ITimetableModel extends Document {
  classId: Types.ObjectId;
  className?: string;
  schedule: ITimetableSchedule;
}
