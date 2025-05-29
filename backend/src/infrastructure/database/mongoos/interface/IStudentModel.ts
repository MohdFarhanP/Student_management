import { Document, Types } from 'mongoose';

export interface IStudentModel extends Document {
  name: string;
  email: string;
  password: string;
  age: number;
  gender: 'Male' | 'Female';
  roleNumber: string;
  class?: Types.ObjectId | null;
  dob: string;
  profileImage: string;
  address: {
    houseName: string;
    place: string;
    district: string;
    pincode: number;
    phoneNo: number;
    guardianName: string;
    guardianContact: string | null;
  };
  refreshToken?: string;
  isInitialLogin: boolean;
  fileHash: string;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
