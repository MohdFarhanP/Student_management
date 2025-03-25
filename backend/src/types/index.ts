import mongoose from 'mongoose';

export type ObjectId = mongoose.Types.ObjectId;

export interface TimetableSlot {
  period: number;
  teacherId: ObjectId | null;
  subject: string | null;
}

export interface TimetableSchedule {
  [day: string]: TimetableSlot[];
}

export interface TimetableData {
  classId: ObjectId;
  schedule: TimetableSchedule;
}

export interface TeacherData {
  _id: ObjectId;
  name: string;
  subjects: string[];
  availability: { [day: string]: number[] };
}
