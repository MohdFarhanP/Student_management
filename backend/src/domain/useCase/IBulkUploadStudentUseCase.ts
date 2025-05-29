import { IBulkUploadResult } from '../types/interfaces';

export interface IBulkUploadStudentUseCase {
  execute(fileBuffer: Buffer): Promise<IBulkUploadResult>;
}
