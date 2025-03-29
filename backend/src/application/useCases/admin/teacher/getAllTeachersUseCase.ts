import { IRepository } from '../../../../domain/interface/admin/IRepository.js';
import { Teacher } from '../../../../domain/entities/teacher.js';

export class GetAllTeachersUseCase {
  constructor(private teacherRepository: IRepository<Teacher>) {}

  async execute(): Promise<{ data: Teacher[] }> {
    return await this.teacherRepository.getAll();
  }
}
