import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  adminLogin,
  updateUserPassword,
} from '../../api/admin/authenticationApi';

interface User {
  email: string;
  role: string;
  isInitialLogin: boolean;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (
    credentials: { email: string; password: string; role: string },
    thunkAPI
  ) => {
    try {
      const response = await adminLogin(credentials);
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message || 'Login failed');
      }
    }
  }
);

export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async (data: { email: string; password: string; role: string }, thunkAPI) => {
    try {
      const response = await updateUserPassword(data);
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(
          error.message || 'Password update failed'
        );
      }
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          ...state.user!,
          ...action.payload,
          isInitialLogin: false,
        };
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
