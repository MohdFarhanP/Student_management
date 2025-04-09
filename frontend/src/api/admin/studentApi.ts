import { apiRequest } from '../apiClient';

interface Adresss {
  houseName?: string;
  place?: string;
  district?: string;
  pincode?: string | number;
  phoneNo?: string | number;
  guardianName?: string;
  guardianContact?: string | null | undefined;
}

export interface IStudent {
  id: string;
  roleNumber: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  dob?: string;
  class?: string;
  subjectIds?: string[];
  profileImage?: string;
  address?: Adresss;
}

const ADMIN_STUDENT_API_URL = '/students';

interface StudentsResponse {
  students: IStudent[];
  totalCount: number;
}

export const getStudents = (page: number, limit: number) =>
  apiRequest<StudentsResponse>(
    'get',
    `${ADMIN_STUDENT_API_URL}/students`,
    undefined,
    {
      params: { page, limit },
    }
  );

export const addStudent = (data: Partial<IStudent>) =>
  apiRequest<{ data: IStudent }, Partial<IStudent>>(
    'post',
    `${ADMIN_STUDENT_API_URL}/student`,
    data
  ).then((res) => res.data);

export const editStudent = (studentId: string, data: Partial<IStudent>) =>
  apiRequest<IStudent, Partial<IStudent>>(
    'put',
    `${ADMIN_STUDENT_API_URL}/studentById/${studentId}`,
    data
  );

export const deleteStudent = (studentId: string) =>
  apiRequest<{ message: string }, string>(
    'delete',
    `${ADMIN_STUDENT_API_URL}/studentById/${studentId}`
  );
