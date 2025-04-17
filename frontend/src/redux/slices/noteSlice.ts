import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../axios';

export const uploadNote = createAsyncThunk(
  'notes/uploadNote',
  async ({ title, fileUrl }, { rejectWithValue }) => {
    try {
      const response = await api.post('/notes/upload', { title, fileUrl });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchNotes = createAsyncThunk(
  'notes/fetchNotes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/notes');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const downloadNote = createAsyncThunk(
  'notes/downloadNote',
  async (noteId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/notes/download/${noteId}`);
      return response.data.fileUrl;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const noteSlice = createSlice({
  name: 'notes',
  initialState: {
    notes: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadNote.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes.push(action.payload);
      })
      .addCase(uploadNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(downloadNote.pending, (state) => {
        state.loading = true;
      })
      .addCase(downloadNote.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default noteSlice.reducer;

