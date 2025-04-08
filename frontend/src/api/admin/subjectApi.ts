import axios, { AxiosError } from 'axios';
import { ADMIN_API_URL } from './bulkUploadApi';
import { toast } from 'react-toastify';
import { uploadToCloudinary } from '../../utils/cloudinaryUpload';

export interface ISubjectData {
  subjectName: string;
  teachers: string[];
  notes: File[] | null;
}

type Subject = {
  id: string;
  subjectName: string;
};

export const addSubject = async (cls: string, subjectData: ISubjectData) => {
  try {
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
    toast.success('Subject added successfully');
    return response.data;
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
export const updateSubject = async (
  classGrade: string,
  subjectId: string,
  subject: { subjectName: string; teachers: string[]; notes: File[] }
) => {
  try {
    const uploadedNotes = subject.notes
      ? await Promise.all(subject.notes.map((file) => uploadToCloudinary(file)))
      : [];

    const validNotes = uploadedNotes.filter((url) => url !== null);

    const finalSubjectData = {
      ...subject,
      notes: validNotes,
    };

    const response = await axios.put(
      `${ADMIN_API_URL}/classes/${classGrade}/subjects/${subjectId}`,
      finalSubjectData,
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );
    console.log('updated subject data', response.data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data?.message || 'Error updating subject');
    }
    return null;
  }
};
export const deleteSubject = async (classGrade: string, subjectId: string) => {
  try {
    const response = await axios.delete(
      `${ADMIN_API_URL}/classes/${classGrade}/subjects/${subjectId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.log('this is the error from deldetsubject api ', error);
  }
};
