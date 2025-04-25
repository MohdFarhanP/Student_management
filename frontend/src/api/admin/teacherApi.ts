import { apiRequest } from '../apiClient';
import { ITeacher } from '../../pages/admin/Teacher';

const ADMIN_TEACHER_API_URL = '/admin/teacher';

interface TeachersResponse {
    teachers: ITeacher[] | Partial<ITeacher>[];
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
    .then((res)=> res.data);

export const editTeacher = (teacherId: string, data: ITeacher) =>
  apiRequest<ApiResponse<TeachersResponse>, ITeacher>(
    'put',
    `${ADMIN_TEACHER_API_URL}/${teacherId}`,
    data
  )
    .then((res)=> res.data);

export const addTeacher = (data: Partial<ITeacher>) =>
  apiRequest<ApiResponse<TeachersResponse>, Partial<ITeacher>>(
    'post',
    `${ADMIN_TEACHER_API_URL}/teacher`,
    data
  );

export const deleteTeacher = (teacherId: string) =>
  apiRequest<ApiResponse<void>>(
    'delete',
    `${ADMIN_TEACHER_API_URL}/${teacherId}`
  );
