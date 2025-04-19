import mongoose, { Schema } from 'mongoose';
import { IClass } from '../../../domain/interface/IClass';

const ClassSchema = new mongoose.Schema<IClass>({
  name: { type: String, required: true, unique: true },
  section: { type: String, required: true },
  teachers: { type: [Schema.Types.ObjectId], ref: 'Teacher', default: [] },
  timetable: { type: Schema.Types.ObjectId, ref: 'Timetable', default: null },
  students: { type: [Schema.Types.ObjectId], ref: 'Student', default: [] },
  totalStudents: { type: Number, default: 0 },
  tutor: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
  roomNo: { type: String, required: true },
  subjects: { type: [Schema.Types.ObjectId], ref: 'Subject', default: [] },
  grade: { type: String, required: true },
});

export const ClassModel = mongoose.model('Class', ClassSchema);
