import { Student } from '../../../domain/entities/student.js';
import { IRepository } from '../../../domain/interface/IRepository.js';
import { IExcelParser } from '../../../domain/interface/IExcelParser.js';

export class BulkUploadStudentUseCase {
  constructor(
    private studentRepo: IRepository<Student>,
    private studentParser: IExcelParser<Student>
  ) {}

  async execute(fileBuffer: Buffer) {
    try {
      const students = this.studentParser.parse(fileBuffer);
      if (students.length > 0) {
        await this.studentRepo.insertMany(students);
      }
      return { studentsAdded: students.length };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message || 'Error processing student upload');
      }
      throw new Error('An unknown error occurred during bulk upload');
    }
  }
}
