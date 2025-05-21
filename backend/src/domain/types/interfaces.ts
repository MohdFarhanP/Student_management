import { Role, Gender, Day, Grade, Section, SubjectName, RecipientType, MediaType, LeaveStatus } from './enums';
import mongoose, { ObjectId } from 'mongoose';
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
  assignedClass?: mongoose.Types.ObjectId | string | null;
  subject?: mongoose.Types.ObjectId | string | null;
  dateOfBirth: string;
  profileImage?: string;
  fileHash?: string;
  specialization?: string;
  experienceYears?: number;
  qualification?: string;
  availability?: { [key in Day]: number[] };
  isInitialLogin?: boolean;
  isDeleted?: boolean
  refreshToken?: string;
}

// Class entity
export interface IClass {
  id?: string;
  _id?: mongoose.Types.ObjectId;
  name: string;
  section: Section;
  teachers: mongoose.Types.ObjectId[];
  timetable: mongoose.Types.ObjectId | null;
  students: mongoose.Types.ObjectId[];
  totalStudents: number;
  tutor: mongoose.Types.ObjectId | null;
  roomNo: string;
  subjects: mongoose.Types.ObjectId[];
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


  export interface SendMessageDTO {
    chatRoomId: string;
    senderId: string;
    senderRole: Role;
    content?: string;
    mediaUrl?: string;
    mediaType?: MediaType;
  }
  
  export interface TeacherNameDTO {
    id: string;
    name: string;
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
  
  // DTO for frontend
  export interface IClassData {
    id: string;
    name: string;
    grade: string;
    section: string;
    roomNo: string;
    tutor: string | null;
    totalStudents?: number;
  }

  export interface ScheduleLiveSessionDTO {
    title: string;
    classId:string;
    teacherId: string;
    studentIds: string[];
    scheduledAt: Date;
  }  

  export interface JoinLiveSessionDTO {
    sessionId: string;
    participantId: string;
  }

  export interface StudentIdsDTO {
    studentIds: string[];
  }
  
export interface ILiveSession {
  id: string;
  title: string;
  classId:string;
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

export interface IParticipant {
  userId: string;
  role: ParticipantRole;
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

export interface ApplyForLeaveDTO {
  studentId: string;
  date: string;
  reason: string;
}

export interface ViewLeaveHistoryDTO {
  studentId: string; 
  userId: string; 
}

export interface ApproveRejectLeaveDTO {
  leaveId: string;
  teacherId: string;
  status: LeaveStatus.Approved | LeaveStatus.Rejected;
}

export interface AdminDashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
}

export interface StudentDashboardStats {
  attendancePercentage: number;
  pendingLeaves: number;
  upcomingSessions: number;
}

export interface TeacherDashboardStats {
  todayClasses: number;
  pendingLeaves: number;
  upcomingSessions: number;
}

export interface TopClassDto {
  className: string;
  attendancePercentage: number;
}

export interface AttendanceDataDto {
  day: string;
  attendance: number;
}

export interface ClassSubjectDto {
  className: string;
  subject: string;
  classId: string;
}

export interface ScheduleDto {
  period: number;
  subject: string;
  className: string;
}

export interface SessionDto {
  title: string;
  className: string;
  time: string;
  isOngoing: boolean;
  joinLink: string;
}

export interface NewSessionDto {
  title: string;
  classId: string;
  date: string; 
  duration: number; 
}
export interface ILiveSessionDto {
  title: string;
  time: string;
  isOngoing: boolean;
  joinLink?: string; // not implemented yet
}
export interface TrackSessionDurationDTO {
  userId: string;
  sessionId: string;
  durationSeconds: number;
  joinTime: Date;
  leaveTime: Date;
}
export interface StudentAttendance {
  studentId: string;
  studentName: string;
  durationSeconds: number;
  joinTime: Date;
  leaveTime: Date;
}

export interface SessionAttendanceDTO {
  sessionId: string;
  title: string;
  scheduledAt?: Date;
  students: StudentAttendance[];
}

