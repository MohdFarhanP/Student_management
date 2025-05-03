  import mongoose, { Schema } from 'mongoose';
  import { IClass } from '../../../domain/types/interfaces';
  import { Grade, Section } from '../../../domain/types/enums';

  const ClassSchema = new mongoose.Schema<IClass>({
    name: { type: String, required: true, unique: true },
    section: { type: String, required: true, enum: Object.values(Section) },
    teachers: { type: [Schema.Types.ObjectId], ref: 'Teacher', default: [] },
    timetable: { type: Schema.Types.ObjectId, ref: 'Timetable', default: null },
    students: { type: [Schema.Types.ObjectId], ref: 'Student', default: [] },
    totalStudents: { type: Number, default: 0 },
    tutor: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
    roomNo: { type: String, required: true },
    subjects: { type: [Schema.Types.ObjectId], ref: 'Subject', default: [] },
    grade: { type: String, required: true, enum: Object.values(Grade) },
    isDeleted: { type: Boolean, default: false },
    chatRoomId: { type: String, required: true, unique: true }, 
  });

  export const ClassModel = mongoose.model('Class', ClassSchema);