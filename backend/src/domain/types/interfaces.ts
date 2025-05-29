import {
  Role,
  Gender,
  Day,
  Grade,
  Section,
  SubjectName,
  RecipientType,
  MediaType,
  LeaveStatus,
} from './enums';
import mongoose, { ObjectId, Types } from 'mongoose';
import { SessionStatus, ParticipantRole } from './enums';

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
  class?: string;
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
  fileHash?: string;
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
  assignedClass?: string;
  subject?: string;
  dateOfBirth: string;
  profileImage?: string;
  fileHash?: string;
  specialization?: string;
  experienceYears?: number;
  qualification?: string;
  availability?: { [key in Day]: number[] };
  isInitialLogin?: boolean;
  isDeleted?: boolean;
  refreshToken?: string;
}

// Class entity
export interface IClass {
  id?: string;
  name: string;
  section: Section;
  teachers: string[];
  timetable: string | null;
  students: string[];
  totalStudents: number;
  tutor: string;
  roomNo: string;
  subjects: string[];
  grade: Grade;
  chatRoomId: string;
  isDeleted?: boolean;
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
  sent: boolean;
  createdAt: Date;
  scheduledAt?: string;
}

export interface TimetableSlot {
  period: number;
  teacherId?: mongoose.Types.ObjectId | null;
  teacherName?: string;
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
  className?: string;
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

export interface IMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  senderRole: Role;
  content?: string;
  mediaUrl?: string;
  mediaType?: MediaType;
  createdAt: Date;
}

export interface ILiveSession {
  id: string;
  title: string;
  classId: string;
  teacherId: string;
  studentIds: string[];
  scheduledAt: Date;
  status: SessionStatus;
  roomId?: string;
  token?: string;
  participants?: UserInfo[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Leave {
  id: string;
  studentId: string;
  date: string;
  reason: string;
  status: LeaveStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AdminDashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
}
