import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getClasses, addClass, updateClass } from '../../api/admin/classApi';
import { IClassData } from '../../api/admin/classApi';

interface ClassState {
  classes: IClassData[];
  totalCount: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: ClassState = {
  classes: [],
  totalCount: 0,
  status: 'idle',
};

export const fetchClasses = createAsyncThunk(
  'classes/fetchClasses',
  async ({ page, limit }: { page: number; limit: number }) => {
    const response = await getClasses(page, limit);
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
    dispatch(fetchClasses({ page: 1, limit: 5 })); // Re-fetch classes after updating
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
      });
  },
});

export default classSlice.reducer;
