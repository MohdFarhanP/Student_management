import { Role, Gender, Day, Grade, Section, SubjectName, RecipientType, MediaType } from './enums';
import mongoose, { ObjectId } from 'mongoose';

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
  refreshToken?: string;
  isInitialLogin?: boolean;
  isDeleted?: boolean;
  createdAt?: Date; 
  updatedAt?: Date; 
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
  isInitialLogin?: boolean;

}

// Class entity
export interface IClass {
  id?: string;
  name: string;
  section: Section;
  teachers: mongoose.Types.ObjectId[];
  timetable: mongoose.Types.ObjectId | null;
  students: mongoose.Types.ObjectId[];
  totalStudents: number;
  tutor: mongoose.Types.ObjectId;
  roomNo: string;
  subjects: mongoose.Types.ObjectId[];
  grade: Grade;
}

// Subject entity
export interface ISubject {
  id?: string;
  subjectName: SubjectName;
  teachers: mongoose.Types.ObjectId[];
  notes?: string[];
}

// Notification
export interface INotification {
  id: string;
  title: string;
  message: string;
  recipientType: RecipientType;
  recipientIds?: string[];
  senderId: string;
  senderRole: Role;
  isRead: boolean;
  createdAt: Date;
  scheduledAt?: string;
}

export interface TimetableSlot {
  period: number;
  teacherId?: mongoose.Types.ObjectId | null;
  subject?: string | null;
}

export interface TimetableSchedule {
  Monday: TimetableSlot[];
  Tuesday: TimetableSlot[];
  Wednesday: TimetableSlot[];
  Thursday: TimetableSlot[];
  Friday: TimetableSlot[];
}

export interface TimetableData {
  classId: ObjectId;
  schedule: TimetableSchedule;
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


  export interface SendMessageDTO {
    chatRoomId: string;
    senderId: string;
    senderRole: Role;
    content?: string;
    mediaUrl?: string;
    mediaType?: MediaType;
  }
  
  export interface SendNotificationDTO {
    title: string;
    message: string;
    recipientType: RecipientType;
    recipientIds?: string[];
    senderId: string;
    senderRole: Role;
    scheduledAt?: Date;
  }