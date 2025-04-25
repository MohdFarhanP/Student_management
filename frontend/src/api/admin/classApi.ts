import { toast } from 'react-toastify';
import { apiRequest } from '../apiClient';

const ADMIN_CLASS_API_URL = `/admin/classes`;

export interface IClassData {
  name: string;
  grade: string;
  section: string;
  roomNo: string;
  tutor: string;
  totalStudents?: string;
  _id?: string;
}

interface Student {
  id: string;
  name: string;
  studentId: string;
  email: string;
  class: string;
  gender: 'Male' | 'Female';
  profileImage: string;
}

interface Class {
  _id: string;
  name: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export const addClass = (data: IClassData) =>
  apiRequest<ApiResponse<Student>, IClassData>(
    'post',
    `${ADMIN_CLASS_API_URL}/class`,
    data
  ).then((res) => {
    toast.success(res.message);
    return res;
  });

export const getClasses = (page: number, limit: number) =>
  apiRequest<ApiResponse<IClassData[]>>(
    'get',
    `${ADMIN_CLASS_API_URL}/classdata`,
    undefined,
    { params: { page, limit } }
  )
    .then((res)=>res.data);

export const getStudentsByClass = (classId: string) => {
  console.log('classId checking in from getStudentsByClass', classId);
  return apiRequest<ApiResponse<Student[]>>(
    'get',
    `${ADMIN_CLASS_API_URL}/${classId}/students`,
    undefined
  ).then((res)=> res.data);
};

export const getClassNames = () =>
  apiRequest<ApiResponse<IClassData[]>>(
    'get',
    `${ADMIN_CLASS_API_URL}/class`
  )
    .then((res)=> res.data);

export const updateClass = (data: IClassData) =>
  apiRequest<ApiResponse<void>, IClassData>(
    'put',
    `${ADMIN_CLASS_API_URL}/update/${data._id}`,
    data
  ).then((res) => {
    toast.success(res.message);
    return res;
  });

export const fetchClasses = () =>
  apiRequest<ApiResponse<Class[]>>('get', `${ADMIN_CLASS_API_URL}/classlist`)
    .then((res)=> res?.data);
