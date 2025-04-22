export interface ICloudinaryService {
    getFileStream(fileUrl: string): Promise<{ stream: NodeJS.ReadableStream; contentType: string }>;
  }