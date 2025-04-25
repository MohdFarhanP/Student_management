import { Notification } from '../redux/slices/notificationSlice';
import { apiRequest } from './apiClient';

const NOTIFICATION_API_URL = `/notifications`;

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export const FetchNotifications = () =>
  apiRequest<ApiResponse<Notification>>('get', `${NOTIFICATION_API_URL}`);

export const MarkNotificationAsRead = (notificationId: string) =>
  apiRequest('put', `${NOTIFICATION_API_URL}/${notificationId}/read`);
