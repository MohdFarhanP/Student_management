import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { studentsProfileFetch } from '../../api/student/studentApi';

interface StudentProfile {
  name: string;
  rollNumber: string;
  class: string;
  classes: string[];
}

interface StudentState {
  profile: StudentProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: StudentState = {
  profile: null,
  loading: false,
  error: null,
};

export const fetchStudentProfile = createAsyncThunk(
  'student/fetchProfile',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await studentsProfileFetch(email);
      return response;
    } catch (error) {
      console.log(error);
      return rejectWithValue('Failed to fetch student profile');
    }
  }
);

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchStudentProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default studentSlice.reducer;
