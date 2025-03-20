import mongoose from 'mongoose';

export interface ITeacher extends Document {
  name: string;
  email: string;
  password: string;
  gender: 'Male' | 'Female';
  phoneNo: number;
  empId: string;
  assignedClass: mongoose.Types.ObjectId;
  subject?: mongoose.Types.ObjectId | null;
  dateOfBirth: string;
  profileImage?: string;
  specialization?: string;
  experienceYears?: number;
  qualification?: string;
  createdAt: Date;
  updatedAt: Date;
}
