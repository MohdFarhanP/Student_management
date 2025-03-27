import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { ADMIN_API_URL } from './authenticationApi';

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
  address?: {
    houseName?: string;
    place?: string;
    district?: string;
    pincode?: string | number;
    phoneNo?: string | number;
    guardianName?: string;
    guardianContact?: string | null | undefined;
  };
}

export const getStudents = async (page: number, limit: number) => {
  try {
    const response = await axios.get(`${ADMIN_API_URL}/students/students`, {
      params: {
        page,
        limit,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data?.message || 'Error on getting students');
      console.log(error);
    }
    return null;
  }
};
export const addStudent = async (data: Partial<IStudent>) => {
  try {
    const response = await axios.post(
      `${ADMIN_API_URL}/students/student`,
      data,
      {
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || 'Error adding student';
      toast.error(message);
      throw new Error(message);
    }
    throw error;
  }
};
export const editStudent = async (
  studnetId: string,
  data: Partial<IStudent>
) => {
  try {
    const response = await axios.put(
      `${ADMIN_API_URL}/students/studentById/${studnetId}`,
      data,
      {
        withCredentials: true,
      }
    );
    console.log('API Response:', response.data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || 'Error updating teacher';
      toast.error(message);
      console.log('API Error:', error);
      throw new Error(message);
    }
    throw error;
  }
};
export const deleteStudent = async (studentId: string) => {
  try {
    const response = await axios.delete(
      `${ADMIN_API_URL}/students/studentById/${studentId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || 'Error deleting student';
      toast.error(message);
      throw new Error(message);
    }
    throw error;
  }
};
