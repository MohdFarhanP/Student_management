import { Document, Types } from 'mongoose';

export interface ITeacherModel extends Document {
  name: string;
  email: string;
  password: string;
  gender: 'Male' | 'Female';
  phoneNo: number;
  empId: string;
  assignedClass: Types.ObjectId | null;
  subject: Types.ObjectId | null;
  dateOfBirth: string;
  profileImage: string;
  fileHash: string;
  specialization: string;
  experienceYears: number;
  qualification: string;
  isInitialLogin: boolean;
  isDeleted: boolean;
  refreshToken?: string;
  availability: {
    Monday: number[];
    Tuesday: number[];
    Wednesday: number[];
    Thursday: number[];
    Friday: number[];
  };
  createdAt?: Date;
  updatedAt?: Date;
}
