import axios, { AxiosError } from 'axios';
import { ADMIN_API_URL } from './authenticationApi';
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
