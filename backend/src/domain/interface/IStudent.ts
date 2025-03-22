import mongoose from 'mongoose';

export interface IStudent extends mongoose.Document {
  id?: string;
  name: string;
  email: string;
  password: string;
  age: number;
  gender: 'Male' | 'Female';
  roleNumber: string;
  class?: mongoose.Types.ObjectId | null;
  subjectIds?: mongoose.Types.ObjectId[];
  dob: string;
  profileImage?: string;
  address: {
    houseName: string;
    place: string;
    district: string;
    pincode: number;
    phoneNo: number;
    guardianName: string;
    guardianContact?: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
}
