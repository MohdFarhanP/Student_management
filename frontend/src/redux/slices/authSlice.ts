import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import {
  adminLogin,
  updateUserPassword,
  adminLogout,
  refreshUserToken,
} from '../../api/authenticationApi';

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

interface ErrorResponse {
  message: string;
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
    { rejectWithValue }
  ) => {
    try {
      const user = await adminLogin(credentials);
      console.log('userdata after calling login ', user);
      return user;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return rejectWithValue(
        axiosError.response?.data?.message || 'Login failed'
      );
    }
  }
);

export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async (password: string, { rejectWithValue }) => {
    try {
      const user = await updateUserPassword(password);
      console.log('API response:', user);
      return user;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return rejectWithValue(
        axiosError.response?.data?.message || 'Password update failed'
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await adminLogout();
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return rejectWithValue(
        axiosError.response?.data?.message || 'Logout failed'
      );
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await refreshUserToken();
      console.log('the response from the refresh Tocken', response);
      return response;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return rejectWithValue(
        axiosError.response?.data?.message || 'Token refresh failed'
      );
    }
  }
);

export const checkAuthOnLoad = createAsyncThunk(
  'auth/checkAuthOnLoad',
  async (_, { dispatch, rejectWithValue }) => {
    const accessToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('access_token='))
      ?.split('=')[1];
    if (accessToken) {
      try {
        const response = await dispatch(refreshToken()).unwrap();
        return response.user;
      } catch (error) {
        console.error('Auth check failed:', error);
        return rejectWithValue('Authentication check failed');
      }
    }
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
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
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
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
      .addCase(checkAuthOnLoad.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.user = action.payload;
        }
      })
      .addCase(checkAuthOnLoad.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.user = null;
      });
  },
});
export const { logout } = authSlice.actions;
export default authSlice.reducer;
