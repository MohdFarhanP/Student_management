import mongoose, { Schema } from 'mongoose';
import { IStudent } from '../../../domain/interface/IStudent.js';

const StudentSchema = new Schema<IStudent>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    roleNumber: { type: String, required: true, unique: true },
    class: { type: Schema.Types.ObjectId, ref: 'Class', default: null },
    dob: { type: String, required: true },
    profileImage: { type: String, default: '' },
    address: {
      houseName: { type: String, required: true },
      place: { type: String, required: true },
      district: { type: String, required: true },
      pincode: { type: Number, required: true },
      phoneNo: { type: Number, required: true },
      guardianName: { type: String, required: true },
      guardianContact: { type: String, default: null },
    },
  },
  { timestamps: true }
);

export const studentModel = mongoose.model<IStudent>('Student', StudentSchema);
