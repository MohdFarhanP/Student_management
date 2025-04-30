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
    
    const fileHash = await computeFileHash(file);
    console.log('File hash:', fileHash);
    const fileName = file.name || `file-${Date.now()}`;
    console.log('Uploading file:', fileName, 'Type:', file.type, 'Hash:', fileHash, 'Size:', file.size);
    // Request pre-signed URL from backend
    const response = await axios.post<PresignedUrlResponse>('http://localhost:5000/api/generate-presigned-url/', {
      fileName: file.name,
      fileType: file.type,
      fileHash,
      fileSize: file.size
    });

    const { signedUrl, fileUrl } = response.data;
    console.log(`singnedUrl : ${signedUrl},  fileUrl will be : ${fileUrl}`)

    // Upload file to S3 using pre-signed URL
    await axios.put(signedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });

    return fileUrl;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`S3 upload failed: ${error.message}`);
    } else {
      throw new Error('S3 upload failed: Unknown error');
    }  }
};

const computeFileHash = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};