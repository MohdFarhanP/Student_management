import { IRepository } from '../../../domain/interface/IRepository.js';
import { Student } from '../../../domain/entities/student.js';

export class GetAllStudentsUseCase {
  constructor(private studentRepository: IRepository<Student>) {}

  async execute(page: number, limit: number) {
    return await this.studentRepository.getAll(page, limit);
  }
}
