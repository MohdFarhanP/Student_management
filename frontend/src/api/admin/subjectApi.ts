import { apiRequest } from '../apiClient';
import { uploadToCloudinary } from '../../utils/cloudinaryUpload';

const ADMIN_SUBJECT_API = `/admin/classes`;

export interface ISubjectData {
  subjectName: string;
  teachers: string[];
  notes: File[] | null;
}

export interface Subject {
  _id: string;
  subjectName: string;
  teachers: string[];
  notes: string[];
}

export interface FinalSubjectData {
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
  const validNotes = uploadedNotes.filter(
    (url): url is string => typeof url === 'string'
  );
  const finalSubjectData: FinalSubjectData = {
    ...subjectData,
    notes: validNotes,
  };
  return apiRequest<Subject, FinalSubjectData>(
    'post',
    `${ADMIN_SUBJECT_API}/${cls}/subjects`,
    finalSubjectData,
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
};

export const getSubjectsByClass = (cls: string) =>
  apiRequest<Subject[]>('get', `${ADMIN_SUBJECT_API}/${cls}/subjects`);

export const fetchSubjectsByClassId = (classId: string) =>
  apiRequest<Subject[]>('get', `${ADMIN_SUBJECT_API}/${classId}/subject`);

export const updateSubject = async (
  classGrade: string,
  subjectId: string,
  subject: { subjectName: string; teachers: string[]; notes: File[] }
) => {
  const uploadedNotes = subject.notes
    ? await Promise.all(subject.notes.map((file) => uploadToCloudinary(file)))
    : [];
  const validNotes = uploadedNotes.filter(
    (url): url is string => typeof url === 'string'
  );
  const finalSubjectData = { ...subject, notes: validNotes };
  return apiRequest<Subject, FinalSubjectData>(
    'put',
    `${ADMIN_SUBJECT_API}/${classGrade}/subjects/${subjectId}`,
    finalSubjectData,
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
};

export const deleteSubject = (classGrade: string, subjectId: string) =>
  apiRequest<{ message: string }>(
    'delete',
    `${ADMIN_SUBJECT_API}/${classGrade}/subjects/${subjectId}`
  );
