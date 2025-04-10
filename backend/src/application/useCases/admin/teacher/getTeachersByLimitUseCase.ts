import { ITeacherRepository } from '../../../../domain/interface/admin/ITeacherRepository.js';

export class GetTeachersByLimitUseCase {
  constructor(private teacherRepository: ITeacherRepository) {}

  async execute(page: number, limit: number) {
    return await this.teacherRepository.getAllByLimit(page, limit);
  }
}
