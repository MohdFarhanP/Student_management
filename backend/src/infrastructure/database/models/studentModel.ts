import mongoose, { Schema } from 'mongoose';
import { IStudent } from '../../../domain/interface/IStudent.js';

const StudentSchema = new Schema<IStudent>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: 'student123' },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    roleNumber: { type: String, required: true, unique: true },
    class: { type: Schema.Types.ObjectId, ref: 'Class', default: null },
    dob: { type: String, required: true },
    profileImage: { type: String, default: '' },
    address: {
      houseName: { type: String },
      place: { type: String },
      district: { type: String },
      pincode: { type: Number },
      phoneNo: { type: Number },
      guardianName: { type: String },
      guardianContact: { type: String, default: null },
    },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

export const studentModel = mongoose.model<IStudent>('Student', StudentSchema);
