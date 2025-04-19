import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { uploadNoteApi, fetchNotesApi, downloadNoteApi } from '../../api/notesApi';
import { INote, NoteUploadParams } from '../../types/notes';

interface NoteState {
  notes: INote[];
  loading: boolean;
  error: string | null;
}

const initialState: NoteState = {
  notes: [],
  loading: false,
  error: null,
};

export const uploadNote = createAsyncThunk(
  'notes/uploadNote',
  async (data: NoteUploadParams, { rejectWithValue }) => {
    try {
      return await uploadNoteApi(data);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to uplod note'
      );  
    }
  }
);

export const fetchNotes = createAsyncThunk(
  'notes/fetchNotes',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchNotesApi();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch note'
      );  
    }
  }
);

export const downloadNote = createAsyncThunk(
  'notes/downloadNote',
  async (noteId: string, { rejectWithValue }) => {
    try {
      return await downloadNoteApi(noteId);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to download note'
      );  
    }
  }
);

const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes.push(action.payload);
      })
      .addCase(uploadNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(downloadNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadNote.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default noteSlice.reducer;

