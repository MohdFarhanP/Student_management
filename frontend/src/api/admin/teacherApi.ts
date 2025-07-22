import { apiRequest } from '../apiClient';
import { ITeacher } from '../../pages/admin/Teacher';

const ADMIN_TEACHER_API_URL = '/admin/teacher';

interface TeachersResponse {
  teachers: ITeacher[];
  totalCount?: number;
}

interface TeacherName {
  id: string;
  name: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
interface ClassSubject {
  className: string;
  subject: string;
  classId: string;
}

interface Schedule {
  period: number;
  subject: string;
  className: string;
}

interface Session {
  title: string;
  className: string;
  time: string;
  isOngoing: boolean;
  joinLink: string;
}

export const getTeachersNames = () =>
  apiRequest<ApiResponse<TeacherName[]>>(
    'get',
    `${ADMIN_TEACHER_API_URL}/all`
  ).then((res) => res.data);

export const getTeachers = (page: number, limit: number) =>
  apiRequest<ApiResponse<TeachersResponse>>(
    'get',
    `${ADMIN_TEACHER_API_URL}/teachers`,
    undefined,
    {
      params: { page, limit },
    }
  )
    .then((res) => res.data);

export const editTeacher = (teacherId: string, data: ITeacher) =>
  apiRequest<ApiResponse<ITeacher>, ITeacher>(
    'patch',
    `${ADMIN_TEACHER_API_URL}/${teacherId}`,
    data
  )
    .then((res) => res.data);

export const addTeacher = (data: Partial<ITeacher>) =>
  apiRequest<ApiResponse<ITeacher>, Partial<ITeacher>>(
    'post',
    `${ADMIN_TEACHER_API_URL}/teacher`,
    data
  )
    .then((res) => res.data);

export const deleteTeacher = (teacherId: string) =>
  apiRequest<ApiResponse<void>>(
    'delete',
    `${ADMIN_TEACHER_API_URL}/${teacherId}`
  );

export const getTeacherClasses = async () =>
  apiRequest<ApiResponse<ClassSubject[]>>('get', `${ADMIN_TEACHER_API_URL}/classes`)
    .then((res) => res.data);

export const getTodaySchedule = async () =>
  apiRequest<ApiResponse<Schedule[]>>('get', `${ADMIN_TEACHER_API_URL}/schedule/today`)
    .then((res) => res.data);

export const getLiveSessions = async () =>
  apiRequest<ApiResponse<Session[]>>('get', `${ADMIN_TEACHER_API_URL}/sessions`)
    .then((res) => res.data);

export const searchTeachers = async (quary: string) =>
  await apiRequest<ApiResponse<ITeacher[]>>(
    'get',
    `${ADMIN_TEACHER_API_URL}/search?q=${quary}`
  )
    .then((res) => res.data);