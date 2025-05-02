import mongoose, { Schema } from 'mongoose';
import { ITeacher } from '../../../domain/types/interfaces';

const TeacherSchema = new Schema<ITeacher>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: 'teacher123' },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    phoneNo: { type: Number, required: true },
    empId: { type: String, required: true, unique: true },
    assignedClass: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      default: null,
    },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject', default: null },
    dateOfBirth: { type: String, required: true },
    profileImage: { type: String, default: '' },
    fileHash: {type: String, default: ''},
    specialization: { type: String, default: '' },
    experienceYears: { type: Number, default: 0 },
    qualification: { type: String, default: '' },
    isInitialLogin: { type: Boolean, default: true },
    isDeleted: {type: Boolean, default:false},
    availability: {
      type: Object,
      required: true,
      default: {
        Monday: [1, 2, 3, 4, 5, 6],
        Tuesday: [1, 2, 3, 4, 5, 6],
        Wednesday: [1, 2, 3, 4, 5, 6],
        Thursday: [1, 2, 3, 4, 5, 6],
        Friday: [1, 2, 3, 4, 5, 6],
      },
    },
  },
  { timestamps: true }
);

export const TeacherModel = mongoose.model<ITeacher>('Teacher', TeacherSchema);
