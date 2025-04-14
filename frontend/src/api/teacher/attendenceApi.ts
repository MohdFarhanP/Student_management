import { toast } from 'react-toastify';
import { apiRequest } from '../apiClient';

const Teacher_API_URL = '/teacher';

interface MarkAttendanceParams {
  studentId: string;
  date: string;
  period: number;
  status: 'present' | 'absent';
  day: string;
  teacherId?: string;
}

export const markAttendanceStd = async (
  classId: string,
  studentId: string,
  date: string,
  period: number,
  status: 'present' | 'absent',
  day: string,
  teacherId: string
) => {
  const response = await apiRequest<{ message: string }, MarkAttendanceParams>(
    'post',
    `${Teacher_API_URL}/attendance/${classId}/mark`,
    { studentId, date, period, status, day, teacherId }
  );
  toast.success(response.message);
};
