
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

const API_URL = "your_api_base_url_here";

interface Teacher {
    id?: string;
    name: string;
    email: string;
    password?: string;
    gender: 'Male' | 'Female';
    phoneNo: number;
    empId: string;
    assignedClass?: string | null;
    subject?:string | null;
    dateOfBirth: string;
    profileImage?: string;
    specialization?: string;
    experienceYears?: number;
    qualification?: string;
    availability: { [day: string]: number[] };
}

export const teachersProfileFetch = async (email: string): Promise<Teacher | null> => {
  try {
    const response = await axios.get(`${API_URL}/teacher/profile?email=${email}`, {
      withCredentials: true,
    });
    return response.data as Teacher;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data?.message || 'Error on getting teacher profile');
      console.error(error);
    }
    return null;
  }
};
