export interface IGeneratePresignedUrlUseCase {
    execute(fileName: string, fileType: string): Promise<{ signedUrl: string; fileUrl: string }>;
  }