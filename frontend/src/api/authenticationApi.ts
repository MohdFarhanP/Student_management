import { apiRequest } from './apiClient';

const AUTH_API_URL = '/auth';

type UserRole = 'Student' | 'Teacher' | 'Admin';

interface ICredentials {
  email: string;
  password: string;
  role: string;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isInitialLogin?: boolean;
}

interface UpdateUserPasswordParams {
  password: string;
}
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export const adminLogin = (data: ICredentials) =>
  apiRequest<ApiResponse<User>, ICredentials>(
    'post',
    `${AUTH_API_URL}/login`,
    data
  ).then((res) => res.data);

export const updateUserPassword = (password: string) =>
  apiRequest<ApiResponse<User>, UpdateUserPasswordParams>(
    'put',
    `${AUTH_API_URL}/update-password`,
    { password }
  ).then((res) => res.data);

export const adminLogout = () =>
  apiRequest<ApiResponse<void>>('post', `${AUTH_API_URL}/logout`);

export const refreshUserToken = (showErrorToast = true) =>
  apiRequest<ApiResponse<User>>('post', `${AUTH_API_URL}/refresh-token`,
    undefined,
    {showErrorToast},
  ).then((res) => res.data);
