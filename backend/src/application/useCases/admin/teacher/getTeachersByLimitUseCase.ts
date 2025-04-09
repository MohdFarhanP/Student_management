import { IRepository } from '../../../../domain/interface/admin/ITeacherRepository.js';
import { Teacher } from '../../../../domain/entities/teacher.js';

export class GetTeachersByLimitUseCase {
  constructor(private teacherRepository: IRepository<Teacher>) {}

  async execute(page: number, limit: number) {
    return await this.teacherRepository.getAllByLimit(page, limit);
  }
}
