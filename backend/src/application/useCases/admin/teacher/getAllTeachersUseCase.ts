import { ITeacherRepository } from '../../../../domain/interface/admin/ITeacherRepository';
import { IGetAllTeachersUseCase } from '../../../../domain/interface/IGetAllTeachersUseCase';
import { Teacher } from '../../../../domain/entities/teacher';
import { TeacherNameDTO } from '../../../../domain/types/interfaces';

export class GetAllTeachersUseCase implements IGetAllTeachersUseCase {
  constructor(private teacherRepository: ITeacherRepository) {}

  async execute(): Promise<TeacherNameDTO[]> {
    try {
      const { data } = await this.teacherRepository.getAll();
      return data.map((teacher)=>({
          id:teacher.id,
          name:teacher.name
      }));
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch teachers');
    }
  }
}