import { toast } from 'react-toastify';
import { apiRequest } from '../apiClient';
import { STUDENT_API_URL } from '../student/studentApi';

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

export interface StudentId{
  studentIds: string[] 
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
interface TopClass {
  className: string;
  attendancePercentage: number;
}
interface AttendanceData {
  day: string;
  attendance: number;
}
interface GetClassResponse {
  classes: IClassData[],
  totalCount: number
}
interface Class {
  _id: string;
  name: string;
  chatRoomId?:string;
  section?: string;
  grade?: string;
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
  apiRequest<ApiResponse<GetClassResponse>>(
    'get',
    `${ADMIN_CLASS_API_URL}/classdata`,
    undefined,
    { params: { page, limit } }
  )
    .then((res)=>res.data);

export const getClassesById = (userId:string) =>
  apiRequest<ApiResponse<IClassData>>(
    'get',
    `${ADMIN_CLASS_API_URL}/classInfo?userId=${userId}`)
    .then((res)=>res.data);

export const getStudentsByClass = (classId: string) => {
  console.log('classId checking in from getStudentsByClass', classId);
  return apiRequest<ApiResponse<Student[]>>(
    'get',
    `${ADMIN_CLASS_API_URL}/${classId}/students`,
    undefined
  ).then((res)=> res.data);
};

export const getStudentsIdByClass = (classId: string) => {
  console.log('classId checking in from getStudentsByClass', classId);
  return apiRequest<ApiResponse<StudentId>>(
    'get',
    `${ADMIN_CLASS_API_URL}/${classId}/studentsId`,
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
    'patch',
    `${ADMIN_CLASS_API_URL}/update/${data.id}`,
    data
  ).then((res) => {
    toast.success(res.message);
    return res;
  });

export const fetchClasses = () =>
  apiRequest<ApiResponse<Class[]>>('get', `${ADMIN_CLASS_API_URL}/classlist`)
    .then((res)=> res.data);

export const fetchStudentClass = () =>
  apiRequest<ApiResponse<Class>>('get', `${STUDENT_API_URL}/my-class`).then((res) => {
    if (!res.data) {
      throw new Error('Class data not found');
    }
    console.log(res.data)
    return res.data;
  });

// Fetch top classes 
export const getTopClasses = () => {
  return apiRequest<ApiResponse<TopClass[]>>('get', `${ADMIN_CLASS_API_URL}/top-classes`)
    .then((response) =>{
      console.log(response,'top class getting in frontend ');
      return response.data;
    });
};

// Fetch weekly attendance for a class
export const getWeeklyAttendance = (classId: string)=> {
  return apiRequest<ApiResponse<AttendanceData[]>>('get', `${ADMIN_CLASS_API_URL}/weekly-attendance/${classId}`)
    .then((response) => {
      console.log(response,'getweeklyattemdance');
      return response.data
    })
};