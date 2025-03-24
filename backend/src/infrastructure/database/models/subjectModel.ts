import mongoose, { Schema } from 'mongoose';
import { ISubject } from '../../../domain/interface/ISubject.js';

const SubjectSchema = new Schema<ISubject>({
  subjectName: { type: String, required: true },
  teachers: { type: [String], required: true },
  notes: { type: [String], default: [] },
});

export const SubjectModel = mongoose.model<ISubject>('Subject', SubjectSchema);
