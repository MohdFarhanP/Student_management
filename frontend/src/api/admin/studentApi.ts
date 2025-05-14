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

const ADMIN_STUDENT_API_URL = '/admin/students';

interface StudentsResponse {
  students: IStudent[];
  totalCount: number;
}
export interface ILiveSessions {
  title: string;
  time: string;
  isOngoing: boolean;
  joinLink?: string; // not implemented yet
}
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
export const getStudents = (page: number, limit: number) =>
  apiRequest<ApiResponse<StudentsResponse>>('get',`${ADMIN_STUDENT_API_URL}/students`,undefined,
    { params: { page, limit },})
    .then((res)=> res.data );
    
export const getStdLiveSessions = (id: string) =>
  apiRequest<ApiResponse<ILiveSessions[]>>('get', `${ADMIN_STUDENT_API_URL}/sessions/${id}`)
    .then((res)=> res.data);
    

export const addStudent = (data: Partial<IStudent>) =>
  apiRequest<ApiResponse<IStudent>, Partial<IStudent>>(
    'post',
    `${ADMIN_STUDENT_API_URL}/student`,
    data
  ).then((res) => res.data);

export const editStudent = (studentId: string, data: Partial<IStudent>) =>
  apiRequest<ApiResponse<IStudent>, Partial<IStudent>>(
    'patch',
    `${ADMIN_STUDENT_API_URL}/${studentId}`,
    data
  ).then((res)=>res.data);

export const deleteStudent = (studentId: string) =>
  apiRequest<ApiResponse<void>, string>(
    'delete',
    `${ADMIN_STUDENT_API_URL}/${studentId}`
  );
