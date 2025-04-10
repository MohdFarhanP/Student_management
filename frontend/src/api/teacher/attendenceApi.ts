import { toast } from 'react-toastify';
import { apiRequest } from '../apiClient';

const Teacher_API_URL = '/teacher';

interface MarkAttendanceParams {
  studentId: string,
  date: string,
  period: number,
  status: 'present' | 'absent'
}

export const markAttendance = async (
  classId: string,
  studentId: string,
  date: string,
  period: number,
  status: 'present' | 'absent'
) =>
  apiRequest<{message: string}, MarkAttendanceParams>(
    'post',
    `${Teacher_API_URL}/${classId}/attendance`,{studentId,date,period,status}
  ).then((res) => {
    toast.success(res.message);
  });