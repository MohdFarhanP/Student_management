import { ITeacherRepository } from '../../../../domain/repositories/ITeacherRepository';
import { IGetAllTeachersUseCase } from '../../../../domain/useCase/IGetAllTeachersUseCase';
import { TeacherNameDTO } from '../../../dtos/teacherDtos';

export class GetAllTeachersUseCase implements IGetAllTeachersUseCase {
  constructor(private teacherRepository: ITeacherRepository) {}

  async execute(): Promise<TeacherNameDTO[]> {
    try {
      const { data } = await this.teacherRepository.getAll();
      return data.map((teacher) => ({
        id: teacher.id,
        name: teacher.name,
      }));
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Failed to fetch teachers');
    }
  }
}
