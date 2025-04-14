import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAttendance as fetchAttendanceAPI  } from '../../api/student/studentApi';

interface Attendance {
  classId: string;
  studentId: string;
  date: Date;
  period: number;
  status: 'present' | 'absent';
  day: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AttendanceState {
  data: Attendance[];
  loading: boolean;
  error: string | null;
}

const initialState: AttendanceState = {
  data: [],
  loading: false,
  error: null,
};

// Interface for API response
interface ApiAttendance {
  classId: string;
  studentId: string;
  date: string;
  period: number;
  status: 'present' | 'absent';
  day: string;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export const fetchAttendance = createAsyncThunk(
  'attendance/fetchAttendance',
  async (id: string, { rejectWithValue }) => {
    try {
      const response: ApiAttendance[] = await fetchAttendanceAPI(id); // Explicitly type response
      // Transform API response to match Attendance type
      const transformedData: Attendance[] = response.map((record) => ({
        ...record,
        date: new Date(record.date),
        createdAt: record.createdAt ? new Date(record.createdAt) : undefined,
        updatedAt: record.updatedAt ? new Date(record.updatedAt) : undefined,
      }));
      return transformedData;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch attendance');
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default attendanceSlice.reducer;