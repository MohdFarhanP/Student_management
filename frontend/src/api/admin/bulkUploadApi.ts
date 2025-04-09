import { apiUploadRequest } from '../apiClient';

interface UploadResponse {
  message: string;
  count?: number;
}

export const studentsBulkUpload = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return apiUploadRequest<UploadResponse>(
    '/upload/students/bulk-upload',
    formData
  );
};

export const teachersBulkUpload = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return apiUploadRequest<UploadResponse>(
    '/upload/teachers/bulk-upload',
    formData
  );
};
