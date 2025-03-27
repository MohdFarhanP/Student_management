import axios, { AxiosError } from 'axios';
import { ADMIN_API_URL } from './authenticationApi';
import { toast } from 'react-toastify';
import { ITeacher } from '../../pages/admin/Teacher';

export const getTeachersNames = async () => {
  try {
    const response = await axios.get(`${ADMIN_API_URL}/teacher/allTeachers`, {
      withCredentials: true,
    });
    console.log('response from api ', response.data);
    return response.data.teachers;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data?.message || 'Error on getting teachers');
      console.log(error);
    }
    return null;
  }
};
export const getTeachers = async (page: number, limit: number) => {
  try {
    const response = await axios.get(`${ADMIN_API_URL}/teacher/teachers`, {
      params: {
        page,
        limit,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data?.message || 'Error on getting teachers');
      console.log(error);
    }
    return null;
  }
};
export const editTeacher = async (teacherId: string, data: ITeacher) => {
  try {
    const response = await axios.put(
      `${ADMIN_API_URL}/teacher/teacherById/${teacherId}`,
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
export const addTeacher = async (data: Partial<ITeacher>) => {
  try {
    const response = await axios.post(
      `${ADMIN_API_URL}/teacher/addTeacher`,
      data,
      { withCredentials: true }
    );
    console.log('API Response:', response.data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || 'Error adding teacher';
      toast.error(message);
      console.error('API Error:', error);
      throw new Error(message);
    }
    console.error('Unexpected error:', error);
    throw error;
  }
};
export const deleteTeacher = async (teacherId: string) => {
  try {
    const response = await axios.delete(
      `${ADMIN_API_URL}/teacher/teacherById/${teacherId}`,
      { withCredentials: true }
    );
    console.log('API Response:', response.data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || 'Error deleting teacher';
      toast.error(message);
      console.error('API Error:', error);
      throw new Error(message);
    }
    console.error('Unexpected error:', error);
    throw error;
  }
};
