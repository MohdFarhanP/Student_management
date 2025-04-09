import { Teacher } from '../../../../domain/entities/teacher.js';
import { ITeacherRepository } from '../../../../domain/interface/admin/ITeacherRepository.js';
import { IExcelParser } from '../../../../domain/interface/admin/IExcelParser.js';

export class BulkUploadTeacherUseCase {
  constructor(
    private teacherRepo: ITeacherRepository,
    private teacherParser: IExcelParser<Teacher>
  ) {}

  async execute(fileBuffer: Buffer) {
    try {
      const teachers = this.teacherParser.parse(fileBuffer);
      if (teachers.length === 0) {
        throw new Error('No teachers found in the uploaded file');
      }
      await this.teacherRepo.insertMany(teachers);
      return { teachersAdded: teachers.length };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message || 'Error processing teacher upload');
      }
      throw new Error('An unknown error occurred during bulk upload');
    }
  }
}
