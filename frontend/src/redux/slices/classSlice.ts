import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getClasses, addClass, updateClass } from '../../api/admin/classApi';
import { getTeachersNames } from '../../api/admin/teacherApi';
import { IClassData } from '../../api/admin/classApi';

interface Teacher {
  name: string;
  id: string;
}

interface ClassState {
  classes: IClassData[];
  totalCount: number;
  teachers: Teacher[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  teacherStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: ClassState = {
  classes: [],
  totalCount: 0,
  teachers: [],
  status: 'idle',
  teacherStatus: 'idle',
};

export const fetchClasses = createAsyncThunk(
  'classes/fetchClasses',
  async ({ page, limit }: { page: number; limit: number }) => {
    const response = await getClasses(page, limit);
    return response;
  }
);

export const fetchTeachers = createAsyncThunk(
  'classes/fetchTeachers',
  async () => {
    const response = await getTeachersNames();
    return response;
  }
);

export const createClass = createAsyncThunk(
  'classes/createClass',
  async (classData: IClassData, { dispatch }) => {
    await addClass(classData);
    dispatch(fetchClasses({ page: 1, limit: 5 }));
  }
);

export const editClass = createAsyncThunk(
  'classes/editClass',
  async (classData: IClassData, { dispatch }) => {
    await updateClass(classData);
    dispatch(fetchClasses({ page: 1, limit: 5 }));
  }
);

const classSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          state.classes = action.payload.classes;
          state.totalCount = action.payload.totalCount;
        }
      })
      .addCase(fetchClasses.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(fetchTeachers.pending, (state) => {
        state.teacherStatus = 'loading';
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.teacherStatus = 'succeeded';
        if (action.payload) {
          state.teachers = action.payload;
        }
      })
      .addCase(fetchTeachers.rejected, (state) => {
        state.teacherStatus = 'failed';
      });
  },
});

export default classSlice.reducer;