import { Notification } from '../redux/slices/notificationSlice';
import { apiRequest } from './apiClient';

const NOTIFICATION_API_URL = `/notifications`;

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
interface FetchNotificationsParams {
  userId: string;
  userRole:string
}
export const FetchNotifications = (data:FetchNotificationsParams) =>
  apiRequest<ApiResponse<Notification[]>,FetchNotificationsParams>('get', `${NOTIFICATION_API_URL}?userId=${data.userId}&userRole=${data.userRole}`)
    .then((res)=> {
      return res.data
    });

export const MarkNotificationAsRead = (notificationId: string) =>
  apiRequest('patch', `${NOTIFICATION_API_URL}/${notificationId}/read`);
