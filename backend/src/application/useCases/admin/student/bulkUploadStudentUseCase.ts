import { Student } from '../../../../domain/entities/student';
import { IExcelParser } from '../../../../domain/interface/admin/IExcelParser';
import { IStudentRepository } from '../../../../domain/interface/admin/IStudentRepository';
import { IBulkUploadResult } from '../../../../domain/types/interfaces';
import { IBulkUploadStudentUseCase } from '../../../../domain/interface/IBulkUploadStudentUseCase';

export class BulkUploadStudentUseCase implements IBulkUploadStudentUseCase {
  constructor(
    private studentRepo: IStudentRepository,
    private studentParser: IExcelParser<Student>
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