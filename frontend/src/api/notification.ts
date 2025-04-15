import { Notification } from '../redux/slices/notificationSlice';
import { apiRequest } from './apiClient';

const NOTIFICATION_API_URL = `/notifications`;

export const FetchNotifications = () =>
  apiRequest<Notification>('get', `${NOTIFICATION_API_URL}`);

export const MarkNotificationAsRead = (notificationId: string) =>
  apiRequest('put', `${NOTIFICATION_API_URL}/${notificationId}/read`);
