import { Schema } from 'mongoose';
import { ISubjectModel } from '../interface/ISubjectModel';

export const SubjectSchema = new Schema<ISubjectModel>({
  subjectName: {
    type: String,
    required: true,
    enum: [
      'Malayalam',
      'Tamil',
      'Kannada',
      'Urdu',
      'English',
      'Sanskrit',
      'Arabic',
      'Hindi',
      'Math',
      'Physics',
      'Chemistry',
      'Biology',
      'Science',
      'History',
      'Geography',
      'Economics',
      'ComputerScience',
      'Literature',
      'GeneralKnowledge',
    ],
  },
  teachers: { type: [Schema.Types.ObjectId], ref: 'Teacher', required: true },
  notes: { type: [String], default: [] },
});
