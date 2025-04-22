import mongoose from 'mongoose';
import { Day } from '../domain/types/enums';

export type ObjectId = mongoose.Types.ObjectId;

export interface TeacherData {
  _id: ObjectId;
  name: string;
  subjects: string[];
  availability: { [key in Day]: number[] };
}