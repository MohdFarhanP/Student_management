export interface IGeneratePresignedUrlUseCase {
  execute(
    fileName: string,
    fileType: string,
    fileHash: string,
    fileSize?: number
  ): Promise<{ signedUrl: string; fileUrl: string }>;
}
