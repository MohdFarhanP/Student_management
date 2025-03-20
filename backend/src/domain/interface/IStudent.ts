import mongoose from 'mongoose';

export interface IStudent extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  age: number;
  gender: 'Male' | 'Female';
  phoneNo: number;
  roleNumber: string;
  class: mongoose.Types.ObjectId;
  subjectIds: mongoose.Types.ObjectId[];
  dob: string;
  profileImage?: string;
  address: {
    houseName: string;
    place: string;
    district: string;
    pincode: number;
    phoneNo: number;
    guardianName: string;
    guardianContact?: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
