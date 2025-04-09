import { apiRequest } from '../apiClient';
import { TimetableData } from '../../types/timetable';
import { toast } from 'react-toastify';

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
  apiRequest<TimetableData>('get', `/timetable/${classId}`);

export const updateTimetableSlot = (
  classId: string,
  data: AssignTeacherFormData
) =>
  apiRequest<TimetableData, AssignTeacherFormData>(
    'put',
    `/timetable/${classId}/update`,
    data
  ).then((res) => {
    toast.success('Timetable slot updated successfully!');
    return res;
  });

export const deleteTimetableSlot = (classId: string, data: DeleteSlotData) =>
  apiRequest<TimetableData, DeleteSlotData>(
    'delete',
    `/timetable/${classId}/slot`,
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
    `/timetable/${classId}/assign`,
    data
  ).then((res) => {
    toast.success('Teacher assigned successfully!');
    return res;
  });
