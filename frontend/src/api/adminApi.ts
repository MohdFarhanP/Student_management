import axios, { AxiosError } from 'axios';

const ADMIN_API_URL = `http://localhost:5000/api/admin`;

interface data {
  email: string;
  password: string;
}
export const adminLogin = async (data: data) => {
  try {
    const response = await axios.post(`${ADMIN_API_URL}/login`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log('this is the error ', error.response?.data?.message);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
    throw new Error('An unexpected error occurred');
  }
};
