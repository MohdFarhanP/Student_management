import { apiRequest } from './apiClient';

const AUTH_API_URL = '/auth';

type UserRole = "Student" | "Teacher" | "Admin";

interface ICredentials {
  email: string;
  password: string;
  role: string;
}

interface User {
  id: string;
  email: string;
  role: UserRole;
  isInitialLogin?: boolean;
}

interface LoginResponse {
  message: string;
  user: User;
}

interface TokenResponse {
  message: string;
  user: User;
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

export const adminLogout = () =>
  apiRequest<void>('post', `${AUTH_API_URL}/logout`);

export const refreshUserToken = () =>
  apiRequest<TokenResponse>('post', `${AUTH_API_URL}/refresh-token`).then(
    (res) => res.user
  );