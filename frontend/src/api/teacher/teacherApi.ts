import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import TeacherProfile from '../../pages/teacher/TeacherProfile';

const TEACHER_API_URL = 'http://localhost:5000/api/teacher';

interface Teacher {
  id?: string;
  name: string;
  email: string;
  password?: string;
  gender: 'Male' | 'Female';
  phoneNo: string;
  empId: string;
  assignedClass?: string | null;
  subject?: string | null;
  dateOfBirth: string;
  profileImage?: string;
  specialization?: string;
  experienceYears?: number;
  qualification?: string;
  availability: { [day: string]: number[] };
}

export const teachersProfileFetch = async (
  email: string
): Promise<Teacher | null> => {
  try {
    const response = await axios.get(
      `${TEACHER_API_URL}/profile?email=${email}`,
      {
        withCredentials: true,
      }
    );
    return response.data as Teacher;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      toast.error(
        error.response?.data?.message || 'Error on getting teacher profile'
      );
      console.error(error);
    }
    return null;
  }
};

export const updateTeacherProfileApi = async (profile: Partial<TeacherProfile>) => {
  const response = await axios.put(`${TEACHER_API_URL}/profile`, profile);
  return response.data;
};
