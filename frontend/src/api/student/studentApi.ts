import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

const STUDENT_API_URL = 'http://localhost:5000/api/student';

export const studentsProfileFetch = async (email: string) => {
  try {
    const response = await axios.get(`${STUDENT_API_URL}/profile/${email}`, {
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
