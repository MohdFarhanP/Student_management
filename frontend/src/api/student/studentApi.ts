import axios, { AxiosError } from 'axios';
import { ADMIN_API_URL } from '../admin/bulkUploadApi';
import { toast } from 'react-toastify';

export const studentsProfileFetch = async (email: string) => {
  try {
    const response = await axios.get(
      `${ADMIN_API_URL}/students/profile/${email}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data?.message || 'Error on getting students');
      console.log(error);
    }
    return null;
  }
};

