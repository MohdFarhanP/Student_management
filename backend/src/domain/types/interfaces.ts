import { Role, Gender, Day } from './enums';
import mongoose from 'mongoose';

// User entity (for authentication)
export interface IUser {
  id: string;
  email: string;
  role: Role;
  password?: string;
  isInitialLogin: boolean;
  refreshToken?: string | null;
}

// Student entity
export interface IStudent {
  id?: string;
  name: string;
  email: string;
  roleNumber: string;
  dob: string;
  gender: Gender;
  age: number;
  class?: mongoose.Types.ObjectId | string | null;
  password?: string;
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
}

// Teacher entity
export interface ITeacher {
  id?: string;
  name: string;
  email: string;
  password?: string;
  gender: Gender;
  phoneNo: number;
  empId: string;
  assignedClass?: mongoose.Types.ObjectId | string | null;
  subject?: mongoose.Types.ObjectId | string | null;
  dateOfBirth: string;
  profileImage?: string;
  specialization?: string;
  experienceYears?: number;
  qualification?: string;
  availability?: { [key in Day]: number[] };
}

// Token response (for auth)
export interface ITokenResponse {
  user: IUser;
  accessToken: string;
  refreshToken?: string;
}

// Bulk upload result
export interface IBulkUploadResult {
  addedCount: number;
}

// Standardized API response
export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}