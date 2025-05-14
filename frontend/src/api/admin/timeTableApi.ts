import { apiRequest } from '../apiClient';
import { TimetableData, TimetableSlot } from '../../types/timetable';
import { toast } from 'react-toastify';

const ADMIN_TIMETABLE_API = `/admin/timetable`;

export type AssignTeacherFormData = {
  day: string;
  period: number;
  teacherId: string;
  subject: string;
};

type DeleteSlotData = {
  day: string;
  period: number;
};

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
};


export const fetchTimetable = (classId: string) =>
  apiRequest<ApiResponse<TimetableData>>('get', `${ADMIN_TIMETABLE_API}/${classId}`)
    .then((res)=> res.data);

export const fetchTimetableForToday = (classId: string) =>
  apiRequest<ApiResponse<TimetableSlot[]>>('get', `${ADMIN_TIMETABLE_API}/today/${classId}`)
    .then((res)=> res.data);

export const updateTimetableSlot = (
  classId: string,
  data: AssignTeacherFormData
) =>
  apiRequest<ApiResponse<TimetableData>, AssignTeacherFormData>(
    'put',
    `${ADMIN_TIMETABLE_API}/${classId}/slot`,
    data
  ).then((res) => {
    toast.success('Timetable slot updated successfully!');
    return res.data;
  });

export const deleteTimetableSlot = (classId: string, data: DeleteSlotData) =>
  apiRequest<ApiResponse<TimetableData>, DeleteSlotData>(
    'delete',
    `${ADMIN_TIMETABLE_API}/${classId}/slot`,
    data
  ).then((res) => {
    toast.success('Timetable slot deleted successfully!');
    return res.data;
  });

export const assignTeacherToClass = (
  classId: string,
  data: AssignTeacherFormData
) =>
  apiRequest<ApiResponse<TimetableData>, AssignTeacherFormData>(
    'put',
    `${ADMIN_TIMETABLE_API}/${classId}/assign`,
    data
  ).then((res) => {
    toast.success('Teacher assigned successfully!');
    return res.data;
  });
