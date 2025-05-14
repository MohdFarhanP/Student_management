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
  console.log(response.message);
};

export const batchMarkAttendanceStd = async (
  classId: string,
  changes: { studentId: string; status: 'present' | 'absent' }[],
  date: string,
  period: number,
  day: string,
  teacherId: string
) => {
  const response = await apiRequest<{ message: string }, any>(
    'post',
    `${Teacher_API_URL}/attendance/${classId}/batch`,
    { changes, date, period, day, teacherId }
  );
  console.log(response.message);
};