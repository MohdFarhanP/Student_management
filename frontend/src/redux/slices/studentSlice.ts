import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  studentsProfileFetch,
  updateProfileImg,
} from '../../api/student/studentApi';

interface IStudent {
  name: string;
  email: string;
  age: number;
  gender: 'Male' | 'Female';
  roleNumber: string;
  class: string | null;
  dob: string;
  profileImage: string;
  address: {
    houseName: string;
    place: string;
    district: string;
    pincode: number;
    phoneNo: number;
    guardianName: string;
    guardianContact: string | null;
  };
  classes?: string[];
}

interface StudentState {
  profile: IStudent | null;
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
        (state, action: PayloadAction<IStudent>) => {
          state.loading = false;
          state.profile = action.payload;
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
        (state, action: PayloadAction<IStudent>) => {
          state.loading = false;
          state.profile = action.payload;
        }
      )
      .addCase(updateStudentProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default studentSlice.reducer;
