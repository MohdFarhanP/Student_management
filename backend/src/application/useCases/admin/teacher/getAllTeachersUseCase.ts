import { ITeacherRepository } from '../../../../domain/interface/admin/ITeacherRepository';
import { Teacher } from '../../../../domain/entities/teacher';

export class GetAllTeachersUseCase {
  constructor(private teacherRepository: ITeacherRepository) {}

  async execute(): Promise<{ data: Teacher[] }> {
    return await this.teacherRepository.getAll();
  }
}
