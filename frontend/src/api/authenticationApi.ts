import axios, { AxiosError } from 'axios';
import { store } from '../redux/store';
import { refreshToken, logout } from '../redux/slices/authSlice';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await store.dispatch(refreshToken()).unwrap();
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

interface ICredentials {
  email: string;
  password: string;
  role: string;
}

export const adminLogin = async (data: ICredentials) => {
  try {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data.user;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
    throw new Error('An unexpected error occurred');
  }
};

export const updateUserPassword = async (password: string) => {
  try {
    const response = await axiosInstance.put('/auth/update-password', { password });
    return response.data.user;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Password update failed');
    }
    throw new Error('An unexpected error occurred');
  }
};

export const adminLogout = async () => {
  try {
    await axiosInstance.post('/auth/logout');
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Logout failed');
    }
    throw new Error('An unexpected error occurred');
  }
};

export const refreshUserToken = async () => {
  try {
    const response = await axiosInstance.post('/auth/refresh-token');
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Token refresh failed');
    }
    throw new Error('An unexpected error occurred');
  }
};