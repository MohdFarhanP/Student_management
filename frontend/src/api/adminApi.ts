import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';
import { ITeacher } from '../pages/admin/Teacher';
import { IStudent } from '../pages/admin/Student';
import { TimetableData } from '../types/timetable';

type AssignTeacherFormData = {
  day: string;
  period: number;
  teacherId: string;
  subject: string;
};

type DeleteSlotData = {
  day: string;
  period: number;
};
export const ADMIN_API_URL = `http://localhost:5000/api/admin`;

interface ICredintials {
  email: string;
  password: string;
}
export interface IClassData {
  name: string;
  grade: string;
  section: string;
  roomNo: string;
  tutor: string;
  totalStudents?: string;
  id?: string;
}
export interface ISubjectData {
  subjectName: string;
  teachers: string[];
  notes: File[] | null;
}

type Subject = {
  id: string;
  name: string;
};

export const adminLogin = async (data: ICredintials) => {
  try {
    const response = await axios.post(`${ADMIN_API_URL}/auth/login`, data, {
      withCredentials: true,
    });

    return response.data?.user;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log('this is the error ', error.response?.data?.message);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
    throw new Error('An unexpected error occurred');
  }
};
export const adminLogout = async () => {
  try {
    await axios.post(`${ADMIN_API_URL}/auth/logout`, { withCredentials: true });
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log('this is the error ', error.response?.data?.message);
      throw new Error(error.response?.data?.message || 'Logout failed');
    }
    throw new Error('An unexpected error occurred');
  }
};
export const addClass = async (data: IClassData) => {
  try {
    const response = await axios.post(`${ADMIN_API_URL}/classes/class`, data, {
      withCredentials: true,
    });
    toast.success(response.data?.message);
    return;
  } catch (error) {
    if (error instanceof AxiosError)
      toast.error('this is the error ', error.response?.data?.message);
    return;
  }
};
export const getClasses = async (
  page: number,
  limit: number
): Promise<{ classes: IClassData[]; totalCount: number } | null> => {
  try {
    const response = await axios.get(`${ADMIN_API_URL}/classes/classdata`, {
      params: {
        page,
        limit,
      },
      withCredentials: true,
    });
    console.log(response);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError)
      toast.error('this is the error ', error.response?.data?.message);
    return null;
  }
};
export const getClassNames = async () => {
  try {
    const response = await axios.get(`${ADMIN_API_URL}/classes/classNames`, {
      withCredentials: true,
    });
    console.log(response);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError)
      toast.error('this is the error ', error.response?.data?.message);
    return null;
  }
};
export const updateClass = async (data: IClassData) => {
  try {
    const response = await axios.put(
      `${ADMIN_API_URL}/class/update/${data.id}`,
      data,
      {
        withCredentials: true,
      }
    );
    console.log('response from the update class', response);
    toast.success(response.data?.message);
    return;
  } catch (error) {
    if (error instanceof AxiosError)
      toast.error('this is the error ', error.response?.data?.message);

    return;
  }
};
export const addSubject = async (cls: string, subjectData: ISubjectData) => {
  try {
    console.log('Notes being sent:', subjectData.notes);

    const uploadedNotes = subjectData.notes
      ? await Promise.all(
        subjectData.notes.map((file) => uploadToCloudinary(file))
      )
      : [];

    const validNotes = uploadedNotes.filter((url) => url !== null);

    const finalSubjectData = {
      ...subjectData,
      notes: validNotes,
    };

    const response = await axios.post(
      `${ADMIN_API_URL}/classes/${cls}/subjects`,
      finalSubjectData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Response:', response.data);
    return;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data?.message || 'Error adding subject');
    }
    return null;
  }
};
export const getSubjectsByClass = async (cls: string) => {
  try {
    console.log(cls);
    const response = await axios.get(
      `${ADMIN_API_URL}/classes/${cls}/subjects`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data?.message || 'Error adding subject');
    }
    return null;
  }
};
export const studentsBulkUpload = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(
      `${ADMIN_API_URL}/upload/students/bulk-upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      }
    );

    toast.success(response.data?.message);
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data?.message || 'Error adding students');
      console.log(error);
    }
    return null;
  }
};
export const teachersBulkUpload = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(
      `${ADMIN_API_URL}/upload/teachers/bulk-upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      }
    );

    toast.success(response.data?.message);
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data?.message || 'Error adding teachers');
      console.log(error);
    }
    return null;
  }
};
export const getTeachers = async (page: number, limit: number) => {
  try {
    const response = await axios.get(`${ADMIN_API_URL}/teacher/teachers`, {
      params: {
        page,
        limit,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data?.message || 'Error on getting teachers');
      console.log(error);
    }
    return null;
  }
};
export const getStudents = async (page: number, limit: number) => {
  try {
    const response = await axios.get(`${ADMIN_API_URL}/student/students`, {
      params: {
        page,
        limit,
      },
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
export const editStudents = async (studnetId: string, data: IStudent) => {
  try {
    const response = await axios.put(
      `${ADMIN_API_URL}/teacher/teacherById${studnetId}`,
      data,
      {
        withCredentials: true,
      }
    );
    console.log('API Response:', response.data);
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
export const editTeacher = async (teacherId: string, data: ITeacher) => {
  try {
    const response = await axios.put(
      `${ADMIN_API_URL}/teacher/teacherById${teacherId}`,
      data,
      {
        withCredentials: true,
      }
    );
    console.log('API Response:', response.data);
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
export const fetchClasses = async () => {
  try {
    const response = await axios.get(`${ADMIN_API_URL}/classes/classlist`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || 'Error fetching classes';
      toast.error(message);
      throw new Error(message);
    }
    throw error;
  }
};
export const fetchSubjectsByClassId = async (
  classId: string
): Promise<Subject[]> => {
  try {
    const response = await axios.get(
      `${ADMIN_API_URL}/classes/${classId}/subject`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const message =
        error.response?.data?.message || 'Error fetching subjects';
      toast.error(message);
      throw new Error(message);
    }
    throw error;
  }
};
export const getTeachersNames = async () => {
  try {
    const response = await axios.get(`${ADMIN_API_URL}/teacher/allTeachers`, {
      withCredentials: true,
    });
    console.log('response from api ', response.data);
    return response.data.teachers;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data?.message || 'Error on getting teachers');
      console.log(error);
    }
    return null;
  }
};