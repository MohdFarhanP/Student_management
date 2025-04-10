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
  id?: string;
}

interface Student {
  id: string;
  name: string;
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
  apiRequest<{ classes: IClassData[]; totalCount: number }>(
    'get',
    `${ADMIN_CLASS_API_URL}/classdata`,
    undefined,
    { params: { page, limit } }
  );
export const getStudentsByClass = (classId:string) =>{
  console.log('classId checking in from getStudentsByClass', classId);
  apiRequest<Student[]>(
    'get',
    `${ADMIN_CLASS_API_URL}/${classId}/students`,
    undefined,
  );
}
  

export const getClassNames = () =>
  apiRequest<{ classNames: string[] }>('get', '/classes/classNames');

export const updateClass = (data: IClassData) =>
  apiRequest<{ message: string }, IClassData>(
    'put',
    `${ADMIN_CLASS_API_URL}/update/${data.id}`,
    data
  ).then((res) => {
    toast.success(res.message);
    return res;
  });

export const fetchClasses = () =>
  apiRequest<IClassData[]>('get', `${ADMIN_CLASS_API_URL}/classlist`);
