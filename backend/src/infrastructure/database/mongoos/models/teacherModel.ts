import mongoose from 'mongoose';
import { ITeacherModel } from '../interface/ITeacherModel';
import { TeacherSchema } from '../scheema/teacherSchema';

export const TeacherModel = mongoose.model<ITeacherModel>(
  'Teacher',
  TeacherSchema
);
