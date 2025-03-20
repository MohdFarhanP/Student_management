import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';
export const ADMIN_API_URL = `http://localhost:5000/api/admin`;

interface ICredintials {
  email: string;
  password: string;
}
export interface IClassData {
  name: string;
  grade: string;
  section: string;
  roomNo: string;
  tutor: string;
  totalStudents?: string;
  id?: string;
}
export interface ISubjectData {
  subjectName: string;
  teachers: string[];
  notes: File[] | null;
}
export const adminLogin = async (data: ICredintials) => {
  try {
    const response = await axios.post(`${ADMIN_API_URL}/auth/login`, data, {
      withCredentials: true,
    });

    return response.data?.user;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log('this is the error ', error.response?.data?.message);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
    throw new Error('An unexpected error occurred');
  }
};
export const adminLogout = async () => {
  try {
    await axios.post(`${ADMIN_API_URL}/auth/logout`, { withCredentials: true });
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log('this is the error ', error.response?.data?.message);
      throw new Error(error.response?.data?.message || 'Logout failed');
    }
    throw new Error('An unexpected error occurred');
  }
};
export const addClass = async (data: IClassData) => {
  try {
    const response = await axios.post(`${ADMIN_API_URL}/classes/class`, data, {
      withCredentials: true,
    });
    toast.success(response.data?.message);
    return;
  } catch (error) {
    if (error instanceof AxiosError)
      toast.error('this is the error ', error.response?.data?.message);
    return;
  }
};
export const getClasses = async (
  page: number,
  limit: number
): Promise<{ classes: IClassData[]; totalCount: number } | null> => {
  try {
    const response = await axios.get(`${ADMIN_API_URL}/classes/class`, {
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
      `${ADMIN_API_URL}/class/update/${data.id}`,
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
export const addSubject = async (cls: string, subjectData: ISubjectData) => {
  try {
    console.log('Notes being sent:', subjectData.notes);

    const uploadedNotes = subjectData.notes
      ? await Promise.all(
        subjectData.notes.map((file) => uploadToCloudinary(file))
      )
      : [];

    const validNotes = uploadedNotes.filter((url) => url !== null);

    const finalSubjectData = {
      ...subjectData,
      notes: validNotes,
    };

    const response = await axios.post(
      `${ADMIN_API_URL}/classes/${cls}/subjects`,
      finalSubjectData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Response:', response.data);
    return;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data?.message || 'Error adding subject');
    }
    return null;
  }
};
export const getSubjectsByClass = async (cls: string) => {
  try {
    console.log(cls);
    const response = await axios.get(
      `${ADMIN_API_URL}/classes/${cls}/subjects`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data?.message || 'Error adding subject');
    }
    return null;
  }
};
