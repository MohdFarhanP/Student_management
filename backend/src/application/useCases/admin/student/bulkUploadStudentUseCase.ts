import { StudentEntity } from '../../../../domain/entities/student';
import { IExcelParser } from '../../../services/IExcelParser';
import { IStudentRepository } from '../../../../domain/repositories/IStudentRepository';
import { IBulkUploadResult } from '../../../../domain/types/interfaces';
import { IBulkUploadStudentUseCase } from '../../../../domain/useCase/IBulkUploadStudentUseCase';

export class BulkUploadStudentUseCase implements IBulkUploadStudentUseCase {
  constructor(
    private studentRepo: IStudentRepository,
    private studentParser: IExcelParser<StudentEntity>
  ) {}

  async execute(fileBuffer: Buffer): Promise<IBulkUploadResult> {
    try {
      const students = this.studentParser.parse(fileBuffer);
      if (students.length === 0) {
        throw new Error('No students found in the uploaded file');
      }

      await this.studentRepo.insertMany(students);
      return { addedCount: students.length };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message || 'Error processing student upload');
      }
      throw new Error('An unknown error occurred during bulk upload');
    }
  }
}
