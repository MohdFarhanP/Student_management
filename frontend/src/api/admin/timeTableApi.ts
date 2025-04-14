import { apiRequest } from '../apiClient';
import { TimetableData } from '../../types/timetable';
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

export const fetchTimetable = (classId: string) =>
  apiRequest<TimetableData>('get', `${ADMIN_TIMETABLE_API}/${classId}`);

export const updateTimetableSlot = (
  classId: string,
  data: AssignTeacherFormData
) =>
  apiRequest<TimetableData, AssignTeacherFormData>(
    'put',
    `${ADMIN_TIMETABLE_API}/${classId}/update`,
    data
  ).then((res) => {
    toast.success('Timetable slot updated successfully!');
    return res;
  });

export const deleteTimetableSlot = (classId: string, data: DeleteSlotData) =>
  apiRequest<TimetableData, DeleteSlotData>(
    'delete',
    `${ADMIN_TIMETABLE_API}/${classId}/slot`,
    data
  ).then((res) => {
    toast.success('Timetable slot deleted successfully!');
    return res;
  });

export const assignTeacherToClass = (
  classId: string,
  data: AssignTeacherFormData
) =>
  apiRequest<TimetableData, AssignTeacherFormData>(
    'put',
    `${ADMIN_TIMETABLE_API}/${classId}/assign`,
    data
  ).then((res) => {
    toast.success('Teacher assigned successfully!');
    return res;
  });
