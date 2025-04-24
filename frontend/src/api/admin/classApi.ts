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

interface ClassResponse {
  success: boolean;
  message: string;
  data:{
    classes: IClassData[]
    totalCount?: number
  }
}

export const addClass = (data: IClassData) =>
  apiRequest<{ message: string }, IClassData>(
    'post',
    `${ADMIN_CLASS_API_URL}/class`,
    data
  ).then((res) => {
    toast.success(res.message);
    return res;
  });

export const getClasses = (page: number, limit: number) =>
  apiRequest<ClassResponse>(
    'get',
    `${ADMIN_CLASS_API_URL}/classdata`,
    undefined,
    { params: { page, limit } }
  )
    .then((res)=>res.data);
export const getStudentsByClass = (classId: string) => {
  console.log('classId checking in from getStudentsByClass', classId);
  return apiRequest<Student[]>(
    'get',
    `${ADMIN_CLASS_API_URL}/${classId}/students`,
    undefined
  );
};

export const getClassNames = () =>
  apiRequest<{ classNames: string[] }>(
    'get',
    `${ADMIN_CLASS_API_URL}/classNames`
  );

export const updateClass = (data: IClassData) =>
  apiRequest<{ message: string }, IClassData>(
    'put',
    `${ADMIN_CLASS_API_URL}/update/${data._id}`,
    data
  ).then((res) => {
    toast.success(res.message);
    return res;
  });

export const fetchClasses = () =>
  apiRequest<Class[]>('get', `${ADMIN_CLASS_API_URL}/classlist`);
