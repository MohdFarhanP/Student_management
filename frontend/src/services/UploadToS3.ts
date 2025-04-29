import axios from 'axios';

export enum FileType {
    PDF = 'application/pdf',
    DOC = 'application/msword',
    DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    JPEG = 'image/jpeg',
    PNG = 'image/png',
    GIF = 'image/gif',
  }
  
export const uploadToS3 = async (file: File): Promise<string> => {
  const allowedTypes = Object.values(FileType);
  const maxSize = 10 * 1024 * 1024; // 10MB

  // Client-side validation for UX
  if (!allowedTypes.includes(file.type as FileType)) {
    throw new Error('Invalid file type. Only PDF, DOCX, and images (JPEG, PNG, GIF) are allowed.');
  }
  if (file.size > maxSize) {
    throw new Error('File size exceeds 10MB limit.');
  }

  try {
    // Request pre-signed URL from backend
    const response = await axios.post('http://localhost:3000/generate-presigned-url', {
      fileName: file.name,
      fileType: file.type,
    });

    const { signedUrl, fileUrl } = response.data;

    // Upload file to S3 using pre-signed URL
    await axios.put(signedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });

    return fileUrl;
  } catch (error) {
    throw new Error(`S3 upload failed: ${error.message}`);
  }
};