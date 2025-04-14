import axios from 'axios';

export const uploadToCloudinary = async (
  file: Express.Multer.File
): Promise<string | null> => {
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

  if (!uploadPreset || !cloudName) {
    console.error('Missing Cloudinary config in .env');
    return null;
  }

  const formData = new FormData();
  formData.append('file', file.buffer, file.originalname);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.secure_url || null;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Cloudinary upload error:', error.response?.data);
    } else {
      console.error('Unexpected error:', error);
    }
    return null;
  }
};
