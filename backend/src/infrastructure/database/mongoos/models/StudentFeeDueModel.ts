import mongoose from 'mongoose';
import { IStudentFeeDueModel } from '../interface/IStudentFeeDueModel';
import { StudentFeeDueSchema } from '../scheema/studentFeeDueSchema';

export const StudentFeeDueModel = mongoose.model<IStudentFeeDueModel>(
  'StudentFeeDue',
  StudentFeeDueSchema
);
