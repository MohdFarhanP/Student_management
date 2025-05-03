import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  StudentProfile,
  studentsProfileFetch,
  updateProfileImg,
} from '../../api/student/studentApi';



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
  'student/fetchStudentProfile',
  async (email: string, { rejectWithValue }) => {
    try {
      const data = await studentsProfileFetch(email);
      console.log('fetched students data studentslice: ',data)
      return data;
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

export const updateStudentProfileImage = createAsyncThunk(
  'student/updateStudentProfileImage',
  async (
    { email, profileImage }: { email: string; profileImage: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await updateProfileImg(profileImage, email);
      return data;
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
      .addCase(
        fetchStudentProfile.fulfilled,
        (state, action) => {
          state.loading = false;
          state.profile = action.payload!;
        }
      )
      .addCase(fetchStudentProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(updateStudentProfileImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateStudentProfileImage.fulfilled,
        (state, action) => {
          state.loading = false;
          state.profile = action.payload!;
        }
      )
      .addCase(updateStudentProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default studentSlice.reducer;
