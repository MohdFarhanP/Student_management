import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

const STUDENT_API_URL = 'http://localhost:5000/api/student';

// Fetch student profile by email
export const studentsProfileFetch = async (email: string) => {
  try {
    const response = await axios.get(`${STUDENT_API_URL}/profile/${email}`, {
      withCredentials: true, 
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || 'Error fetching student profile';
      toast.error(message);
      console.error('Error fetching student profile:', error);
    }
    throw error; 
  }
};

// Update student profile image
export const updateProfileImg = async (imgUrl: string, email: string) => {
  try {
    const response = await axios.patch(
      `${STUDENT_API_URL}/profile/image`,
      { email, profileImage: imgUrl }, 
      {
        withCredentials: true, 
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    toast.success('Profile image updated successfully');
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || 'Error updating profile image';
      toast.error(message);
      console.error('Error updating profile image:', error);
    }
    throw error; 
  }
};