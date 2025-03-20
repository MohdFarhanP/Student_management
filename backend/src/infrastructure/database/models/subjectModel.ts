import mongoose, { Schema, Document } from 'mongoose';

interface ISubject extends Document {
  subjectName: string;
  teachers: string[];
  notes: string[];
}

const SubjectSchema = new Schema<ISubject>({
  subjectName: { type: String, required: true },
  teachers: { type: [String], required: true },
  notes: { type: [String], default: [] },
});

const SubjectModel = mongoose.model<ISubject>('Subject', SubjectSchema);
export { SubjectModel, ISubject };
