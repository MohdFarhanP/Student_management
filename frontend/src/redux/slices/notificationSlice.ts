import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  FetchNotifications,
  MarkNotificationAsRead,
} from '../../api/notification';

export interface Notification {
  id: string;
  title: string;
  message: string;
  recipientType: 'global' | 'role' | 'Student';
  recipientIds?: string[];
  senderId: string;
  senderRole: 'Admin' | 'Teacher';
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  'notification/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await FetchNotifications(); // Await the promise
      // Normalize response to array
      return Array.isArray(response) ? response : response ? [response] : [];
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch notifications'
      );
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notification/markNotificationAsRead',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      await MarkNotificationAsRead(notificationId); // Assumes this handles correct URL internally
      return notificationId;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Failed to mark notification as read'
      );
    }
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      // Ensure notifications is an array
      if (!Array.isArray(state.notifications)) {
        state.notifications = [];
      }
      // Prevent duplicates by checking id
      if (!state.notifications.some((n) => n.id === action.payload.id)) {
        state.notifications.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
        if (!Array.isArray(state.notifications)) {
          state.notifications = [];
        }
      })
      .addCase(
        fetchNotifications.fulfilled,
        (state, action: PayloadAction<Notification[]>) => {
          state.loading = false;
          // Remove duplicates by id
          const uniqueNotifications = Array.isArray(action.payload)
            ? action.payload.reduce((acc: Notification[], curr) => {
                if (!acc.some((n) => n.id === curr.id)) {
                  acc.push(curr);
                }
                return acc;
              }, [])
            : [];
          state.notifications = uniqueNotifications;
        }
      )
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.notifications = [];
      })
      .addCase(
        markNotificationAsRead.fulfilled,
        (state, action: PayloadAction<string>) => {
          const notification = state.notifications.find(
            (n) => n.id === action.payload
          );
          if (notification) {
            notification.isRead = true;
          }
        }
      )
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
