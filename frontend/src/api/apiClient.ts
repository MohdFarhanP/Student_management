import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import { store } from '../redux/store';
import { refreshToken, logoutUser } from '../redux/slices/authSlice';

const AXIOS_BASE_URL = import.meta.env.VITE_AXIOS_BASE_URL;

const axiosInstance = axios.create({
  baseURL: AXIOS_BASE_URL,
  withCredentials: true,
});

// Interceptor for handling 401 errors and token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/refresh-token'
    ) {
      originalRequest._retry = true;
      try {
        await store.dispatch(refreshToken({showErrorToast: false})).unwrap();
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        store.dispatch(logoutUser());
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
  config?: AxiosRequestConfig & { showErrorToast?: boolean }
): Promise<T> => {
  const showToast = config?.showErrorToast ?? true;
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
      const status = error.response?.status;
      const isRefresh = error.config?.url === '/auth/refresh-token';

      if (status === 500) {
        console.error('[apiRequest] 500 Internal Server Error at', new Date().toISOString(), { method, url });
        window.location.href = '/500';
        toast.error('Internal Server Error');
      }

      if (status === 401 && !isRefresh && showToast) {
        toast.error('Unauthorized');
      }

      const message =
        error.response?.data?.message || `${method.toUpperCase()} request failed`;

      if (showToast && status !== 401) toast.error(message);

      throw new Error(message);
    }

    if (showToast) toast.error('An unexpected error occurred');
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
