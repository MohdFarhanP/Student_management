import { Document, Types } from 'mongoose';

export interface IClassModel extends Document {
  name: string;
  section: 'A' | 'B' | 'C' | 'D' | 'E';
  teachers: Types.ObjectId[];
  timetable?: Types.ObjectId | null;
  students: Types.ObjectId[];
  totalStudents: number;
  tutor: Types.ObjectId;
  roomNo: string;
  subjects: Types.ObjectId[];
  grade:
    | '1'
    | '2'
    | '3'
    | '4'
    | '5'
    | '6'
    | '7'
    | '8'
    | '9'
    | '10'
    | '11'
    | '12';
  chatRoomId: string;
  isDeleted?: boolean;
}
