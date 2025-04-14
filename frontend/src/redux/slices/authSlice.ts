import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { adminLogin, refreshUserToken, adminLogout, updateUserPassword } from '../../api/authenticationApi';

interface User {
  id: string;
  email: string;
  role: string;
  isInitialLogin?: boolean;
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
  async (credentials: { email: string; password: string; role: string }, { rejectWithValue }) => {
    try {
      const response = await adminLogin(credentials);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed';
      return rejectWithValue(message);
    }
  }
);

export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async (password: string, { rejectWithValue }) => {
    try {
      const response = await updateUserPassword(password);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Password update failed';
      return rejectWithValue(message);
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await refreshUserToken();
      console.log('refreshToken: response=', response);
      return response;
    } catch (error: unknown) {
      console.error('refreshToken: error=', error);
      const message = error instanceof Error ? error.message : 'Token refresh failed';
      return rejectWithValue(message);
    }
  }
);

export const checkAuthOnLoad = createAsyncThunk(
  'auth/checkAuthOnLoad',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await dispatch(refreshToken()).unwrap();
      console.log('checkAuthOnLoad: refreshToken response=', response);
      return response;
    } catch (error) {
      console.error('checkAuthOnLoad: refreshToken failed:', error);
      return rejectWithValue('Authentication check failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await adminLogout();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Logout failed';
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.user = null;
      })
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.user = null;
      })
      .addCase(checkAuthOnLoad.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuthOnLoad.fulfilled, (state, action: PayloadAction<User | null>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(checkAuthOnLoad.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.user = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.error = null;
        state.loading = false;
      });
  },
});

export default authSlice.reducer;
