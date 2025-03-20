import axios from 'axios';

export const uploadToCloudinary = async (
  file: File
): Promise<string | null> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ngfp0ut2');

  try {
    const response = await axios.post(
      'https://api.cloudinary.com/v1_1/dvsfcb824/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.secure_url || null;
  } catch (error) {
    console.error('Upload failed:', error);
    return null;
  }
};
