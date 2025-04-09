import { apiRequest } from './apiClient';

const AUTH_API_URL = '/auth';

interface ICredentials {
  email: string;
  password: string;
  role: string;
}

interface User {
  email: string;
  role: string;
  isInitialLogin: boolean;
}

interface LoginResponse {
  message: string;
  user: User;
}

interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
}

interface UpdateUserPasswordParams {
  password: string;
}

export const adminLogin = (data: ICredentials) =>
  apiRequest<LoginResponse, ICredentials>(
    'post',
    `${AUTH_API_URL}/login`,
    data
  ).then((res) => res.user);

export const updateUserPassword = (password: string) =>
  apiRequest<LoginResponse, UpdateUserPasswordParams>(
    'put',
    `${AUTH_API_URL}/update-password`,
    { password }
  ).then((res) => res.user);

export const adminLogout = () => apiRequest<void>('post', '/auth/logout');

export const refreshUserToken = () =>
  apiRequest<TokenResponse>('post', `${AUTH_API_URL}/refresh-token`);
