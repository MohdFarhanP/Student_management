import { TeacherEntity } from '../../../../domain/entities/teacher';
import { ITeacherRepository } from '../../../../domain/repositories/ITeacherRepository';
import { IExcelParser } from '../../../services/IExcelParser';
import { IBulkUploadResult } from '../../../../domain/types/interfaces';
import { IBulkUploadTeacherUseCase } from '../../../../domain/useCase/IBulkUploadTeacherUseCase';

export class BulkUploadTeacherUseCase implements IBulkUploadTeacherUseCase {
  constructor(
    private teacherRepo: ITeacherRepository,
    private teacherParser: IExcelParser<TeacherEntity>
  ) {}

  async execute(fileBuffer: Buffer): Promise<IBulkUploadResult> {
    try {
      const teachers = this.teacherParser.parse(fileBuffer);
      if (teachers.length === 0) {
        throw new Error('No teachers found in the uploaded file');
      }
      await this.teacherRepo.insertMany(teachers);
      return { addedCount: teachers.length };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message || 'Error processing teacher upload');
      }
      throw new Error('An unknown error occurred during bulk upload');
    }
  }
}
