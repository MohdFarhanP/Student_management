import mongoose from 'mongoose';
import { ISubjectModel } from '../interface/ISubjectModel';
import { SubjectSchema } from '../scheema/subjectSchema';

export const SubjectModel = mongoose.model<ISubjectModel>(
  'Subject',
  SubjectSchema
);
