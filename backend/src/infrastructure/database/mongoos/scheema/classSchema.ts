import mongoose, { Schema } from 'mongoose';
import { IClassModel } from '../interface/IClassModel';

export const ClassSchema = new mongoose.Schema<IClassModel>({
  name: { type: String, required: true, unique: true },
  section: { type: String, required: true, enum: ['A', 'B', 'C', 'D', 'E'] },
  teachers: [{ type: Schema.Types.ObjectId, ref: 'Teacher', default: [] }],
  timetable: { type: Schema.Types.ObjectId, ref: 'Timetable', default: null },
  students: [{ type: Schema.Types.ObjectId, ref: 'Student', default: [] }],
  totalStudents: { type: Number, required: true, default: 0 },
  tutor: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
  roomNo: { type: String, required: true },
  subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject', default: [] }],
  grade: {
    type: String,
    required: true,
    enum: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  },
  chatRoomId: { type: String, required: true, unique: true },
  isDeleted: { type: Boolean, default: false },
});
