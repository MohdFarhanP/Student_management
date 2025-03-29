import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export const ADMIN_API_URL = `http://localhost:5000/api/admin`;

export const studentsBulkUpload = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(
      `${ADMIN_API_URL}/upload/students/bulk-upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      }
    );

    toast.success(response.data?.message);
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data?.message || 'Error adding students');
      console.log(error);
    }
    return null;
  }
};
export const teachersBulkUpload = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(
      `${ADMIN_API_URL}/upload/teachers/bulk-upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      }
    );

    toast.success(response.data?.message);
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data?.message || 'Error adding teachers');
      console.log(error);
    }
    return null;
  }
};
