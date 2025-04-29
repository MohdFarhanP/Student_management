export interface IStorageService {
  bucketName: string;
  region: string;
  generatePresignedUrl(fileName: string, fileType: string): Promise<{ signedUrl: string; fileUrl: string }>;
  generatePresignedDownloadUrl(fileKey: string): Promise<string>;
}