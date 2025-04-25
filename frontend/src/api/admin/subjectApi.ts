import { apiRequest } from '../apiClient';
import { uploadToCloudinary } from '../../utils/cloudinaryUpload';

const ADMIN_SUBJECT_API = `/admin/classes`;

export interface ISubjectData {
  subjectName: string;
  teachers: string[];
  notes: File[] | null;
}

export interface ISubject {
  id: string;
  subjectName: string;
  teachers: { _id: string ,name: string }[];
  notes: string[];
}

export interface FinalSubjectData {
  subjectName: string;
  teachers: string[];
  notes: string[];
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export const addSubject = async (cls: string, subjectData: ISubjectData) => {
  const uploadedNotes = subjectData.notes
    ? await Promise.all(subjectData.notes.map((file) => uploadToCloudinary(file)))
    : [];
  const validNotes = uploadedNotes.filter((url): url is string => typeof url === 'string');
  const finalSubjectData: FinalSubjectData = {
    ...subjectData,
    notes: validNotes,
  };
  return apiRequest<ApiResponse<ISubject>, FinalSubjectData>(
    'post',
    `${ADMIN_SUBJECT_API}/${cls}/subjects`,
    finalSubjectData,
    {
      headers: { 'Content-Type': 'application/json' },
    }
  ).then((res) => res.data);
};

export const getSubjectsByClass = (cls: string) =>
  apiRequest<ApiResponse<ISubject[]>>('get', `${ADMIN_SUBJECT_API}/${cls}/subjects`)
    .then((res) => {
      console.log('this is the res.data from getsubjectByclass from fronted api ',res.data)
      return res.data});

export const fetchSubjectsByClassId = (classId: string) =>
  apiRequest<ApiResponse<ISubject[]>>('get', `${ADMIN_SUBJECT_API}/${classId}/subject`)
    .then((res) => res.data);

export const updateSubject = async (
  classGrade: string,
  subjectId: string,
  subject: { subjectName: string; teachers: string[]; notes: File[] }
) => {
  const uploadedNotes = subject.notes
    ? await Promise.all(subject.notes.map((file) => uploadToCloudinary(file)))
    : [];
  const validNotes = uploadedNotes.filter((url): url is string => typeof url === 'string');
  const finalSubjectData = { ...subject, notes: validNotes };
  return apiRequest<ApiResponse<ISubject>, FinalSubjectData>(
    'put',
    `${ADMIN_SUBJECT_API}/${classGrade}/subjects/${subjectId}`,
    finalSubjectData,
    {
      headers: { 'Content-Type': 'application/json' },
    }
  ).then((res) => res.data);
};

export const deleteSubject = (classGrade: string, subjectId: string) =>
  apiRequest<ApiResponse<void>>('delete', `${ADMIN_SUBJECT_API}/${classGrade}/subjects/${subjectId}`)
    .then((res) => res.data);