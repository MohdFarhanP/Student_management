import { IRepository } from '../../../domain/interface/IRepository.js';
import { Teacher } from '../../../domain/entities/teacher.js';

export class GetAllTeachersUseCase {
  constructor(private teacherRepository: IRepository<Teacher>) {}

  async execute(page: number, limit: number) {
    return await this.teacherRepository.getAll(page, limit);
  }
}
