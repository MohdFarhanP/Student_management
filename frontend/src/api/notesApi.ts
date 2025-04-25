import { apiRequest } from './apiClient';
import { INote, NoteUploadParams } from '../types/notes';

const NOTES_API_URL = '/notes';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export const uploadNoteApi = (data: NoteUploadParams) =>
  apiRequest<ApiResponse<INote>, NoteUploadParams>('post', `${NOTES_API_URL}/upload`, data).then((res) => res.data);

export const fetchNotesApi = () =>
  apiRequest<ApiResponse<INote[]>>('get', NOTES_API_URL).then((res) => res).then((res) => res.data);

export const downloadNoteApi = (noteId: string) =>
  apiRequest<ApiResponse<void>>('get', `${NOTES_API_URL}/download/${noteId}`).then(() => undefined);