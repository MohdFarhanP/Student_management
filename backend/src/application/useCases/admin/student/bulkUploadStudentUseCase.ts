import { Student } from '../../../../domain/entities/student.js';
import { IExcelParser } from '../../../../domain/interface/admin/IExcelParser.js';
import { IStudentRepository } from '../../../../domain/interface/admin/IStudentRepository.js';

export class BulkUploadStudentUseCase {
  constructor(
    private studentRepo: IStudentRepository,
    private studentParser: IExcelParser<Student>
  ) {}

  async execute(fileBuffer: Buffer) {
    try {
      const students = this.studentParser.parse(fileBuffer);
      if (students.length === 0) {
        throw new Error('No students found in the uploaded file');
      }

      await this.studentRepo.insertMany(students);
      return { studentsAdded: students.length };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message || 'Error processing student upload');
      }
      throw new Error('An unknown error occurred during bulk upload');
    }
  }
}
