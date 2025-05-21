import { apiRequest } from '../apiClient';

const TEACHER_API_URL = '/teacher';

type Availability = {
  Monday: number[];
  Tuesday: number[];
  Wednesday: number[];
  Thursday: number[];
  Friday: number[];
};

export interface Teacher {
  id: string;
  name: string;
  email: string;
  gender: 'Male' | 'Female';
  phoneNo: string;
  empId: string;
  assignedClass: string | null;
  subject: string | null;
  dateOfBirth: string;
  profileImage: string;
  specialization: string;
  experienceYears: number;
  qualification: string;
  availability?: Availability;
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
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export const teachersProfileFetch = (email: string) =>
  apiRequest<ApiResponse<Teacher>>('get', `${TEACHER_API_URL}/profile`, undefined, {
    params: { email },
  })
    .then((res)=> res.data);

export const fetchSessionAttendance = () =>
  apiRequest<ApiResponse<SessionAttendanceDTO[]>>('get', `${TEACHER_API_URL}/sessions/attendance`)
    .then((res) => res.data);

export const updateTeacherProfileApi = (profile: Partial<Teacher>) =>
  apiRequest<ApiResponse<Teacher>, Partial<Teacher>>(
    'put',
    `${TEACHER_API_URL}/profile`,
    profile
  )
    .then((res)=> res.data);