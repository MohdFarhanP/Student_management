import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import classReducer from './slices/classSlice';
import studentReducer from './slices/studentSlice';
import teacherReducer from './slices/teacherSlice';
import attendanceReducer from './slices/attendanceSlice';
import chatReducer from './slices/chatSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    classes: classReducer,
    student: studentReducer,
    teacher: teacherReducer,
    attendance: attendanceReducer,
    chat: chatReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
