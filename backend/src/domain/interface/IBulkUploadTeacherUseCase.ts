import { IBulkUploadResult } from '../types/interfaces';

export interface IBulkUploadTeacherUseCase {
  execute(fileBuffer: Buffer): Promise<IBulkUploadResult>;
}