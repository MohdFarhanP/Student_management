import { apiRequest } from './apiClient';
import { INote, NoteUploadParams } from '../types/notes';
import axios from 'axios';
const AXIOS_BASE_URL = import.meta.env.VITE_AXIOS_BASE_URL;

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

// export const downloadNoteApi = (noteId: string) =>
//   apiRequest<ApiResponse<void>>('get', `${NOTES_API_URL}/download/${noteId}`).then(() => undefined);


export const downloadNoteApi = async (noteId: string): Promise<void> => {
  try {
    const response = await axios.get(`${AXIOS_BASE_URL}${NOTES_API_URL}/download/${noteId}`, {
      withCredentials:true,
      responseType: 'blob', // Handle binary file response
    });
    // Create a temporary URL for the blob and trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = `note-${noteId}`; // Fallback name; adjust if title is available
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to download note');
  }
};