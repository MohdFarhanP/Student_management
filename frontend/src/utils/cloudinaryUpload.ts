import axios from 'axios';

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  if (!uploadPreset || !cloudName) {
    throw new Error('Missing Cloudinary configuration');
  }

  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/gif',
  ];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only PDF, DOCX, and images (JPEG, PNG, GIF) are allowed.');
  }
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('File size exceeds 10MB limit.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset); // Ensure ngfOut2 is used
  formData.append('resource_type', file.type.startsWith('image/') ? 'image' : 'raw');
  formData.append('access_mode', 'public'); // Explicitly set to public

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/${file.type.startsWith('image/') ? 'image' : 'raw'}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    if (!response.data.secure_url) {
      throw new Error('Failed to retrieve Cloudinary URL');
    }
    return response.data.secure_url;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error?.message || 'Cloudinary upload failed'
      );
    }
    throw new Error('Unexpected error during upload');
  }
};