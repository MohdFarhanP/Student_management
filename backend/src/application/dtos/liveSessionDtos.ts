import { UserInfo } from '../../domain/types/interfaces';
import { StudentAttendance } from './attendanceDtos';

export interface ScheduleLiveSessionDTO {
  title: string;
  classId: string;
  teacherId: string;
  studentIds: string[];
  scheduledAt: Date;
}

export interface JoinLiveSessionDTO {
  sessionId: string;
  participantId: string;
}

export interface TrackSessionDurationDTO {
  userId: string;
  sessionId: string;
  durationSeconds: number;
  joinTime: Date;
  leaveTime: Date;
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

export interface SessionAttendanceDTO {
  sessionId: string;
  title: string;
  scheduledAt?: Date;
  students: StudentAttendance[];
}

export interface ILiveSessionDto {
  title: string;
  time: string;
  isOngoing: boolean;
  joinLink?: string; // not implemented yet
}

export interface JoinLiveSessionResponse {
  roomId: string;
  token: string;
  participants?: UserInfo[];
}
