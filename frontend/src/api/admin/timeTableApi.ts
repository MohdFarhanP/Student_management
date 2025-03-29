import { ADMIN_API_URL } from './bulkUploadApi';
import { TimetableData } from '../../types/timetable';
import axios, { AxiosError } from 'axios';
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

export const fetchTimetable = async (classId: string) => {
  try {
    const response = await axios.get<TimetableData>(
      `${ADMIN_API_URL}/timetable/${classId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const message =
        error.response?.data?.message || 'Error fetching timetable';
      toast.error(message);
      throw new Error(message);
    }
    throw error;
  }
};
export const updateTimetableSlot = async (
  classId: string,
  data: AssignTeacherFormData
) => {
  try {
    const response = await axios.put(
      `${ADMIN_API_URL}/timetable/${classId}/update`,
      data,
      {
        withCredentials: true,
      }
    );
    toast.success('Timetable slot updated successfully!');
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const message =
        error.response?.data?.message || 'Error updating timetable slot';
      toast.error(message);
      throw new Error(message);
    }
    throw error;
  }
};
export const deleteTimetableSlot = async (
  classId: string,
  data: DeleteSlotData
) => {
  try {
    const response = await axios.delete(
      `${ADMIN_API_URL}/timetable/${classId}/slot`,
      {
        data,
        withCredentials: true,
      }
    );
    toast.success('Timetable slot deleted successfully!');
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const message =
        error.response?.data?.message || 'Error deleting timetable slot';
      toast.error(message);
      throw new Error(message);
    }
    throw error;
  }
};
export const assignTeacherToClass = async (
  classId: string,
  data: AssignTeacherFormData
) => {
  try {
    const response = await axios.put(
      `${ADMIN_API_URL}/timetable/${classId}/assign`,
      data,
      {
        withCredentials: true,
      }
    );
    console.log('Timetable updated:', response.data);
    toast.success('Teacher assigned successfully!');
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || 'Error updating teacher';
      toast.error(message);
      console.log('API Error:', error);
      throw new Error(message);
    }
    throw error;
  }
};
