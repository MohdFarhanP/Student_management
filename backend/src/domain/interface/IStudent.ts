import mongoose, { Document } from 'mongoose';

export interface IStudent extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  age: number;
  gender: 'Male' | 'Female';
  roleNumber: string;
  class?: mongoose.Types.ObjectId | null;
  dob: string;
  profileImage?: string;
  address: {
    houseName: string;
    place: string;
    district: string;
    pincode: number;
    phoneNo: number;
    guardianName: string;
    guardianContact?: string | null | undefined;
  };
  refreshToken?: string;
  isInitialLogin?: boolean;
  isDeleted:boolean;
  createdAt: Date;
  updatedAt: Date;
}
