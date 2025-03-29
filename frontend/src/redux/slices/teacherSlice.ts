import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { teachersProfileFetch } from '../../api/teacher/teacherApi';

interface TeacherProfile {
  id?: string;
  name: string;
  email: string;
  password?: string;
  gender: 'Male' | 'Female';
  phoneNo: number;
  empId: string;
  assignedClass?: string | null;
  subject?:string | null;
  dateOfBirth: string;
  profileImage?: string;
  specialization?: string;
  experienceYears?: number;
  qualification?: string;
  availability: { [day: string]: number[] };
}

interface TeacherState {
  profile: TeacherProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: TeacherState = {
  profile: null,
  loading: false,
  error: null,
};

export const fetchTeacherProfile = createAsyncThunk(
  'teacher/fetchProfile',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await teachersProfileFetch(email);
      return response;
    } catch (error) {
      console.log(error);
      return rejectWithValue('Failed to fetch teacher profile');
    }
  }
);

const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacherProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchTeacherProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default teacherSlice.reducer;
