import mongoose from 'mongoose';
import { IStudentModel } from '../interface/IStudentModel';
import { StudentSchema } from '../scheema/studentSchema';

export const studentModel = mongoose.model<IStudentModel>(
  'Student',
  StudentSchema
);
