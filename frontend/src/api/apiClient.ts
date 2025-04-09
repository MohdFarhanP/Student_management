import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import { store } from '../redux/store';
import { refreshToken, logout } from '../redux/slices/authSlice';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

// Interceptor for handling 401 errors and token refresh
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

const apiRequest = async <T, D = undefined>(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await axiosInstance({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const message =
        error.response?.data?.message ||
        `${method.toUpperCase()} request failed`;
      toast.error(message);
      throw new Error(message);
    }
    toast.error('An unexpected error occurred');
    throw error;
  }
};

// Special case for file uploads (e.g., FormData)
const apiUploadRequest = async <T>(
  url: string,
  formData: FormData
): Promise<T> => {
  try {
    const response = await axiosInstance.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    toast.success(response.data?.message || 'Upload successful');
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || 'Upload failed';
      toast.error(message);
      throw new Error(message);
    }
    toast.error('An unexpected error occurred');
    throw error;
  }
};

export { apiRequest, apiUploadRequest };
