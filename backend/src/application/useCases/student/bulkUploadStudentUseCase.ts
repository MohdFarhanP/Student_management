import { Student } from '../../../domain/entities/student.js';
import { IRepository } from '../../../domain/interface/IRepository.js';
import { IExcelParser } from '../../../domain/interface/IExcelParser.js';

export class BulkUploadStudentUseCase {
  constructor(
    private studentRepo: IRepository<Student>,
    private studentParser: IExcelParser<Student>
  ) {}

  async execute(fileBuffer: Buffer) {
    const students = this.studentParser.parse(fileBuffer);
    if (students.length > 0) {
      await this.studentRepo.insertMany(students);
    }
    return { studentsAdded: students.length };
  }
}
