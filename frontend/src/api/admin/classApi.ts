import { toast } from 'react-toastify';
import { apiRequest } from '../apiClient';

export interface IClassData {
  name: string;
  grade: string;
  section: string;
  roomNo: string;
  tutor: string;
  totalStudents?: string;
  id?: string;
}

export const addClass = (data: IClassData) =>
  apiRequest<{ message: string }, IClassData>(
    'post',
    '/classes/class',
    data
  ).then((res) => {
    toast.success(res.message);
    return res;
  });

export const getClasses = (page: number, limit: number) =>
  apiRequest<{ classes: IClassData[]; totalCount: number }>(
    'get',
    '/classes/classdata',
    undefined,
    { params: { page, limit } }
  );

export const getClassNames = () =>
  apiRequest<{ classNames: string[] }>('get', '/classes/classNames');

export const updateClass = (data: IClassData) =>
  apiRequest<{ message: string }, IClassData>(
    'put',
    `/classes/update/${data.id}`,
    data
  ).then((res) => {
    toast.success(res.message);
    return res;
  });

export const fetchClasses = () =>
  apiRequest<IClassData[]>('get', '/classes/classlist');
