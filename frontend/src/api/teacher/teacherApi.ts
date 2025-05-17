import { apiRequest } from '../apiClient';

const TEACHER_API_URL = '/teacher';

type Availability = {
  Monday: number[];
  Tuesday: number[];
  Wednesday: number[];
  Thursday: number[];
  Friday: number[];
};

export interface Teacher {
  id: string;
  name: string;
  email: string;
  gender: 'Male' | 'Female';
  phoneNo: string;
  empId: string;
  assignedClass: string | null;
  subject: string | null;
  dateOfBirth: string;
  profileImage: string;
  specialization: string;
  experienceYears: number;
  qualification: string;
  availability?: Availability;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export const teachersProfileFetch = (email: string) =>
  apiRequest<ApiResponse<Teacher>>('get', `${TEACHER_API_URL}/profile`, undefined, {
    params: { email },
  })
    .then((res)=> res.data);

export const updateTeacherProfileApi = (profile: Partial<Teacher>) =>{
  console.log('teacher edit details',profile)
  apiRequest<ApiResponse<Teacher>, Partial<Teacher>>(
    'put',
    `${TEACHER_API_URL}/profile`,
    profile
  )
    .then((res)=> res.data);
}