import axios, { AxiosError } from 'axios';
import { ADMIN_API_URL } from './bulkUploadApi';
import { toast } from 'react-toastify';

export interface IClassData {
  name: string;
  grade: string;
  section: string;
  roomNo: string;
  tutor: string;
  totalStudents?: string;
  id?: string;
}

export const addClass = async (data: IClassData) => {
  try {
    const response = await axios.post(`${ADMIN_API_URL}/classes/class`, data, {
      withCredentials: true,
    });
    toast.success(response.data?.message);
    return;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data?.message);
    }
    return;
  }
};
export const getClasses = async (
  page: number,
  limit: number
): Promise<{ classes: IClassData[]; totalCount: number } | null> => {
  try {
    const response = await axios.get(`${ADMIN_API_URL}/classes/classdata`, {
      params: {
        page,
        limit,
      },
      withCredentials: true,
    });
    console.log(response);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError)
      toast.error('this is the error ', error.response?.data?.message);
    return null;
  }
};
export const getClassNames = async () => {
  try {
    const response = await axios.get(`${ADMIN_API_URL}/classes/classNames`, {
      withCredentials: true,
    });
    console.log(response);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError)
      toast.error('this is the error ', error.response?.data?.message);
    return null;
  }
};
export const updateClass = async (data: IClassData) => {
  try {
    const response = await axios.put(
      `${ADMIN_API_URL}/classes/update/${data.id}`,
      data,
      {
        withCredentials: true,
      }
    );
    console.log('response from the update class', response);
    toast.success(response.data?.message);
    return;
  } catch (error) {
    if (error instanceof AxiosError)
      toast.error('this is the error ', error.response?.data?.message);

    return;
  }
};
export const fetchClasses = async () => {
  try {
    const response = await axios.get(`${ADMIN_API_URL}/classes/classlist`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || 'Error fetching classes';
      toast.error(message);
      throw new Error(message);
    }
    throw error;
  }
};
