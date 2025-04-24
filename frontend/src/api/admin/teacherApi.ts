import { apiRequest } from '../apiClient';
import { ITeacher } from '../../pages/admin/Teacher';

const ADMIN_TEACHER_API_URL = '/admin/teacher';

interface TeachersResponse {
  message: string;
  success: boolean;
  data:{
    teachers: ITeacher[] | Partial<ITeacher>[];
    totalCount?: number;
  }
}

export const getTeachersNames = () =>
  apiRequest<{ teachers: ITeacher[] }>(
    'get',
    `${ADMIN_TEACHER_API_URL}/all`
  ).then((res) => res.teachers);

export const getTeachers = (page: number, limit: number) =>
  apiRequest<TeachersResponse>(
    'get',
    `${ADMIN_TEACHER_API_URL}/teachers`,
    undefined,
    {
      params: { page, limit },
    }
  )
    .then((res)=> res.data);

export const editTeacher = (teacherId: string, data: ITeacher) =>
  apiRequest<TeachersResponse, ITeacher>(
    'put',
    `${ADMIN_TEACHER_API_URL}/${teacherId}`,
    data
  )
    .then((res)=> res.data);

export const addTeacher = (data: Partial<ITeacher>) =>
  apiRequest<TeachersResponse, Partial<ITeacher>>(
    'post',
    `${ADMIN_TEACHER_API_URL}/teacher`,
    data
  );

export const deleteTeacher = (teacherId: string) =>
  apiRequest<{ message: string }>(
    'delete',
    `${ADMIN_TEACHER_API_URL}/${teacherId}`
  );
