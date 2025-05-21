import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  teachersProfileFetch,
  updateTeacherProfileApi,
} from '../../api/teacher/teacherApi';

type Availability = {
  Monday: number[];
  Tuesday: number[];
  Wednesday: number[];
  Thursday: number[];
  Friday: number[];
};

export interface TeacherProfile {
  id?: string;
  name: string;
  email: string;
  password?: string;
  gender: 'Male' | 'Female';
  phoneNo: string;
  empId: string;
  assignedClass?: string | null;
  subject?: string | null;
  dateOfBirth: string;
  profileImage?: string;
  specialization?: string;
  experienceYears?: number;
  qualification?: string;
  availability?: Availability;
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

      if (!response || typeof response !== 'object') {
        throw new Error('Invalid data received from API');
      }

      return response;
    } catch (error: unknown) {
      let errorMessage = 'Failed to fetch teacher profile';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error('Error fetching teacher profile:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateTeacherProfile = createAsyncThunk<
TeacherProfile,
Partial<TeacherProfile>,
{ rejectValue: string }
>(
  'teacher/updateTeacherProfile',
  async (profile: Partial<TeacherProfile>, { rejectWithValue }) => {
    try {
      const response = await updateTeacherProfileApi(profile);

      if (!response || typeof response !== 'object') {
        throw new Error('Invalid data received from API');
      }

      return response;
    } catch (error: unknown) {
      let errorMessage = 'Failed to fetch teacher profile';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error('Error fetching teacher profile:', errorMessage);
      return rejectWithValue(errorMessage);
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
        state.profile = action.payload ?? null;
      })
      .addCase(fetchTeacherProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateTeacherProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeacherProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateTeacherProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default teacherSlice.reducer;
