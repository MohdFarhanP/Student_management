import mongoose, { Schema } from 'mongoose';
import { ISubject } from '../../../domain/types/interfaces';
import { SubjectName } from '../../../domain/types/enums';

const SubjectSchema = new Schema<ISubject>({
  subjectName: { type: String, required: true, enum: Object.values(SubjectName) },
  teachers: { type: [Schema.Types.ObjectId], ref: 'Teacher', required: true },
  notes: { type: [String], default: [] },
});

export const SubjectModel = mongoose.model<ISubject>('Subject', SubjectSchema);