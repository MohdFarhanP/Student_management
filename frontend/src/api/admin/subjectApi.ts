import { apiRequest } from '../apiClient';
import { uploadToCloudinary } from '../../utils/cloudinaryUpload';

export interface ISubjectData {
  subjectName: string;
  teachers: string[];
  notes: File[] | null;
}

interface Subject {
  id: string;
  subjectName: string;
  teachers: string[];
  notes: string[];
}

interface FinalSubjectData {
  subjectName: string;
  teachers: string[];
  notes: string[];
}

export const addSubject = async (cls: string, subjectData: ISubjectData) => {
  const uploadedNotes = subjectData.notes
    ? await Promise.all(
      subjectData.notes.map((file) => uploadToCloudinary(file))
    )
    : [];
  const validNotes = uploadedNotes.filter((url) => url !== null);
  const finalSubjectData = { ...subjectData, notes: validNotes };
  return apiRequest<Subject, FinalSubjectData>(
    'post',
    `/classes/${cls}/subjects`,
    finalSubjectData,
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
};

export const getSubjectsByClass = (cls: string) =>
  apiRequest<Subject[]>('get', `/classes/${cls}/subjects`);

export const fetchSubjectsByClassId = (classId: string) =>
  apiRequest<Subject[]>('get', `/classes/${classId}/subject`);

export const updateSubject = async (
  classGrade: string,
  subjectId: string,
  subject: { subjectName: string; teachers: string[]; notes: File[] }
) => {
  const uploadedNotes = subject.notes
    ? await Promise.all(subject.notes.map((file) => uploadToCloudinary(file)))
    : [];
  const validNotes = uploadedNotes.filter((url) => url !== null);
  const finalSubjectData = { ...subject, notes: validNotes };
  return apiRequest<Subject, FinalSubjectData>(
    'put',
    `/classes/${classGrade}/subjects/${subjectId}`,
    finalSubjectData,
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
};

export const deleteSubject = (classGrade: string, subjectId: string) =>
  apiRequest<{ message: string }>(
    'delete',
    `/classes/${classGrade}/subjects/${subjectId}`
  );
