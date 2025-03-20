import { Teacher } from '../../../domain/entities/teacher.js';
import { IRepository } from '../../../domain/interface/IRepository.js';
import { IExcelParser } from '../../../domain/interface/IExcelParser.js';

export class BulkUploadTeacherUseCase {
  constructor(
    private teacherRepo: IRepository<Teacher>,
    private teacherParser: IExcelParser<Teacher>
  ) {}

  async execute(fileBuffer: Buffer) {
    const teachers = this.teacherParser.parse(fileBuffer);
    if (teachers.length > 0) {
      await this.teacherRepo.insertMany(teachers);
    }
    return { teachersAdded: teachers.length };
  }
}
