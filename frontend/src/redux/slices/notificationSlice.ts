import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FetchNotifications, MarkNotificationAsRead } from '../../api/notification';

export interface Notification {
  id: string;
  title: string;
  message: string;
  recipientType: 'global' | 'role' | 'Student';
  recipientIds?: string[];
  senderId: string;
  senderRole: 'Admin' | 'Teacher';
  isRead: boolean;
  sent: boolean;
  createdAt: string;
  scheduledAt?: string;
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
      const response = await FetchNotifications();
      console.log('fetched data form backend' ,response)
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.log(error)
      return rejectWithValue('Failed to fetch notifications');
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notification/markNotificationAsRead',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      await MarkNotificationAsRead(notificationId);
      return notificationId;
    } catch (error) {
      console.log(error)
      return rejectWithValue('Failed to mark notification as read');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
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
      })
      .addCase(fetchNotifications.fulfilled, (state, action: PayloadAction<Notification[]>) => {
        state.loading = false;
        console.log("fetchNotifications.fulfilled",action.payload)
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action: PayloadAction<string>) => {
        const notification = state.notifications.find((n) => n.id === action.payload);
        if (notification) {
          notification.isRead = true;
        }
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;