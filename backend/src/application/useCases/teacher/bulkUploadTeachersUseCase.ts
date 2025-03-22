import { Teacher } from '../../../domain/entities/teacher.js';
import { IRepository } from '../../../domain/interface/IRepository.js';
import { IExcelParser } from '../../../domain/interface/IExcelParser.js';

export class BulkUploadTeacherUseCase {
  constructor(
    private teacherRepo: IRepository<Teacher>,
    private teacherParser: IExcelParser<Teacher>
  ) {}

  async execute(fileBuffer: Buffer) {
    try {
      const teachers = this.teacherParser.parse(fileBuffer);
      if (teachers.length > 0) {
        await this.teacherRepo.insertMany(teachers);
      }
      return { teachersAdded: teachers.length };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message || 'Error processing teacher upload');
      }
      throw new Error('An unknown error occurred during bulk upload');
    }
  }
}
