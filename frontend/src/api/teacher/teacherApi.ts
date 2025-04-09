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
  phoneNo: number;
  empId: string;
  assignedClass: string | null;
  subject: string | null;
  dateOfBirth: string;
  profileImage: string;
  specialization: string;
  experienceYears: number;
  qualification: string;
  availability: Availability;
}

export const teachersProfileFetch = (email: string) =>
  apiRequest<Teacher>('get', `${TEACHER_API_URL}/profile`, undefined, {
    params: { email },
  });

export const updateTeacherProfileApi = (profile: Partial<Teacher>) =>
  apiRequest<Teacher, Partial<Teacher>>(
    'patch',
    `${TEACHER_API_URL}/profile`,
    profile
  );
