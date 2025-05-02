import axios from 'axios';

export enum FileType {
  PDF = 'application/pdf',
  DOC = 'application/msword',
  DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  GIF = 'image/gif',
}

interface PresignedUrlResponse {
  signedUrl: string;
  fileUrl: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export const uploadToS3 = async (file: File): Promise<{ fileUrl: string; fileHash: string }> => {
  const allowedTypes = Object.values(FileType);
  const maxSize = 10 * 1024 * 1024; // 10MB

  // Validate the file object
  if (!file || !(file instanceof File)) {
    throw new Error('Invalid file: File is required and must be a valid File object');
  }

  // Client-side validation for UX
  if (!allowedTypes.includes(file.type as FileType)) {
    throw new Error('Invalid file type. Only PDF, DOCX, and images (JPEG, PNG, GIF) are allowed.');
  }
  if (file.size > maxSize) {
    throw new Error('File size exceeds 10MB limit.');
  }

  try {
    const fileHash = await computeFileHash(file);
    console.log('File hash:', fileHash);

    // Ensure fileName is always defined and includes an extension
    const fileExtension = file.type ? `.${file.type.split('/')[1]}` : '';
    const fileName = file.name && file.name.trim() !== ''
      ? file.name
      : `file-${Date.now()}${fileExtension}`;
    console.log('Uploading file:', fileName, 'Type:', file.type, 'Hash:', fileHash, 'Size:', file.size);

    // Request pre-signed URL from backend
    const response = await axios.post<ApiResponse<PresignedUrlResponse>>(
      'http://localhost:5000/api/generate-presigned-url/',
      {
        fileName, // Use the computed fileName instead of file.name
        fileType: file.type,
        fileHash,
        fileSize: file.size,
      },
      { withCredentials: true }
    );

    console.log('in frontend response from backend ', response.data.data);
    const { signedUrl, fileUrl } = response.data.data!;
    console.log(`signedUrl: ${signedUrl}, fileUrl will be: ${fileUrl}`);

    // Upload file to S3 using pre-signed URL
    await axios.put(signedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });

    return { fileUrl, fileHash };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`S3 upload failed: ${error.message}`);
    } else {
      throw new Error('S3 upload failed: Unknown error');
    }
  }
};

const computeFileHash = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};