import { ITeacherRepository } from '../../../../domain/interface/admin/ITeacherRepository';
import { IGetAllTeachersUseCase } from '../../../../domain/interface/IGetAllTeachersUseCase';
import { Teacher } from '../../../../domain/entities/teacher';

export class GetAllTeachersUseCase implements IGetAllTeachersUseCase {
  constructor(private teacherRepository: ITeacherRepository) {}

  async execute(): Promise<Teacher[]> {
    try {
      const { data } = await this.teacherRepository.getAll();
      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch teachers');
    }
  }
}