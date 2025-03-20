import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminLogin } from '../../api/adminApi';

interface AuthState {
  user: string | null;
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
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      console.log('credintials ', credentials);
      const response = await adminLogin(credentials);
      console.log('this is the response ', response);
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log('Error in thunk:', error.message);
        return thunkAPI.rejectWithValue(error.message || 'Login failed');
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
      console.log('store');
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
        state.user = action.payload.email;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
