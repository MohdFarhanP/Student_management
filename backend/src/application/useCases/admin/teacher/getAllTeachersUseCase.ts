import { ITeacherRepository } from '../../../../domain/interface/admin/ITeacherRepository.js';
import { Teacher } from '../../../../domain/entities/teacher.js';

export class GetAllTeachersUseCase {
  constructor(private teacherRepository: ITeacherRepository) {}

  async execute(): Promise<{ data: Teacher[] }> {
    return await this.teacherRepository.getAll();
  }
}
