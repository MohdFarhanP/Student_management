import { apiRequest } from './apiClient';
import { INote, NoteUploadParams } from '../types/notes';

const NOTES_API_URL = '/notes';

export const uploadNoteApi = (data: NoteUploadParams) =>
  apiRequest<INote, NoteUploadParams>('post', `${NOTES_API_URL}/upload`, data).then((res) => res);

export const fetchNotesApi = () =>
  apiRequest<INote[]>('get', NOTES_API_URL).then((res) => res);

export const downloadNoteApi = (noteId: string) =>
  apiRequest<void>('get', `${NOTES_API_URL}/download/${noteId}`).then(() => undefined);