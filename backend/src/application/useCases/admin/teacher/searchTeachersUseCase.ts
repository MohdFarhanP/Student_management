import { ITeacherRepository } from '../../../../domain/repositories/ITeacherRepository';
import { ISearchTeachersUseCase } from '../../../../domain/useCase/ISearchTeachersUseCase';
import { TeacherDTO } from '../../../dtos/teacherDtos';

export class SearchTeachersUseCase implements ISearchTeachersUseCase {
  constructor(private teacherRepository: ITeacherRepository) {}
  async execute(quary: string): Promise<TeacherDTO[]> {
    try {
      const teachers = await this.teacherRepository.search(quary);
      if (!teachers || teachers.length === 0) {
        return [];
      }
      return teachers.map((student) => TeacherDTO.fromEntity(student));
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Failed to search students');
    }
  }
}
