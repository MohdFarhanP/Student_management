import mongoose, { Document } from 'mongoose';

export interface ITeacher extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  gender: 'Male' | 'Female';
  phoneNo: number;
  empId: string;
  assignedClass?: mongoose.Types.ObjectId | null;
  subject?: mongoose.Types.ObjectId | null;
  dateOfBirth: string;
  profileImage?: string;
  specialization?: string;
  experienceYears?: number;
  qualification?: string;
  createdAt: Date;
  updatedAt: Date;
  availability: { [day: string]: number[] };
}
