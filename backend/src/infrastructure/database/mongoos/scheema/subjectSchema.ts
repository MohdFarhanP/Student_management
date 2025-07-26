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
      'Urudu',
      'English',
      'Sanskrit',
      'Arabic',
      'Hindi',
      'Mathematics',
      'Physics',
      'Chemistry',
      'Biology',
      'EnvironmentalScience',
      'BasicScience',
      'SocialScience',
      'PhysicalEducation',
      'InformationTechnology',
    ],
  },
  teachers: { type: [Schema.Types.ObjectId], ref: 'Teacher', required: true },
  notes: { type: [String], default: [] },
});
