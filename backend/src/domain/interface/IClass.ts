import { Types } from 'mongoose';

export interface IClass {
  _id?: Types.ObjectId;
  name: string;
  section: string;
  teachers: Types.ObjectId[];
  timetable: Types.ObjectId | null;
  students: Types.ObjectId[];
  totalStudents: number;
  tutor: Types.ObjectId;
  roomNo: string;
  subjects: Types.ObjectId[];
  grade: string;
}
