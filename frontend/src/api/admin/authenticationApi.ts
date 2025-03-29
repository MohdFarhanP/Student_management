import axios, { AxiosError } from 'axios';

export const AUTH_API_URL = `http://localhost:5000/api`;

interface ICredentials {
  email: string;
  password: string;
  role: string;
}

export const adminLogin = async (data: ICredentials) => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/auth/login`, data, {
      withCredentials: true,
    });
    return response.data?.user;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
    throw new Error('An unexpected error occurred');
  }
};

export const updateUserPassword = async (data: ICredentials) => {
  try {
    const response = await axios.put(
      `${AUTH_API_URL}/auth/update-password`,
      data,
      {
        withCredentials: true,
      }
    );
    return response.data?.user;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || 'Password update failed'
      );
    }
    throw new Error('An unexpected error occurred');
  }
};

export const adminLogout = async () => {
  try {
    await axios.post(
      `${AUTH_API_URL}/auth/logout`,
      {},
      { withCredentials: true }
    );
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Logout failed');
    }
    throw new Error('An unexpected error occurred');
  }
};
