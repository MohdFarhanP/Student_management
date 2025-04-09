import { apiRequest } from '../apiClient';
import { ITeacher } from '../../pages/admin/Teacher';

const ADMIN_TEACHER_API_URL = '/admin/teacher';

interface TeachersResponse {
  teachers: ITeacher[];
  totalCount?: number;
}

export const getTeachersNames = () =>
  apiRequest<{ teachers: ITeacher[] }>(
    'get',
    `${ADMIN_TEACHER_API_URL}/allTeachers`
  ).then((res) => res.teachers);

export const getTeachers = (page: number, limit: number) =>
  apiRequest<TeachersResponse>(
    'get',
    `${ADMIN_TEACHER_API_URL}/teachers`,
    undefined,
    {
      params: { page, limit },
    }
  );

export const editTeacher = (teacherId: string, data: ITeacher) =>
  apiRequest<ITeacher, ITeacher>(
    'put',
    `${ADMIN_TEACHER_API_URL}/teacherById/${teacherId}`,
    data
  );

export const addTeacher = (data: Partial<ITeacher>) =>
  apiRequest<ITeacher, Partial<ITeacher>>(
    'post',
    `${ADMIN_TEACHER_API_URL}/addTeacher`,
    data
  );

export const deleteTeacher = (teacherId: string) =>
  apiRequest<{ message: string }>(
    'delete',
    `${ADMIN_TEACHER_API_URL}/teacherById/${teacherId}`
  );
