import mongoose, { Schema } from 'mongoose';
import { ITeacher } from '../../../domain/interface/ITeacher.js';

const TeacherSchema = new Schema<ITeacher>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    phoneNo: { type: Number, required: true },
    empId: { type: String, required: true, unique: true },
    assignedClass: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject', default: null },
    dateOfBirth: { type: String, required: true },
    profileImage: { type: String, default: '' },
    specialization: { type: String, default: '' },
    experienceYears: { type: Number, default: 0 },
    qualification: { type: String, default: '' },
  },
  { timestamps: true }
);

export const TeacherModel = mongoose.model<ITeacher>('Teacher', TeacherSchema);
