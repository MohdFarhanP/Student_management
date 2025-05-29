import { Schema } from 'mongoose';
import { IStudentModel } from '../interface/IStudentModel';

export const StudentSchema = new Schema<IStudentModel>(
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
      houseName: { type: String, default: '' },
      place: { type: String, default: '' },
      district: { type: String, default: '' },
      pincode: { type: Number, default: 0 },
      phoneNo: { type: Number, default: 0 },
      guardianName: { type: String, default: '' },
      guardianContact: { type: String, default: null },
    },
    refreshToken: { type: String },
    isInitialLogin: { type: Boolean, default: true },
    fileHash: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
