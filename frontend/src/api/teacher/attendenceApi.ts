import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

const ADMIN_API_URL = 'http://localhost:5000/api/teacher';

export const markAttendance = async (
  classId: string,
  studentId: string,
  date: string,
  period: number,
  status: 'present' | 'absent'
) => {
  try {
    const response = await axios.post(
      `${ADMIN_API_URL}/classes/${classId}/attendance`,
      { studentId, date, period, status },
      { withCredentials: true }
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || 'Error marking attendance';
      toast.error(message);
      throw new Error(message);
    }
    throw error;
  }
};