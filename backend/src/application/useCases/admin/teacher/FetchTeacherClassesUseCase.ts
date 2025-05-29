import { ITeacherRepository } from '../../../../domain/repositories/ITeacherRepository';
import { ClassSubjectDto } from '../../../dtos/classDtos';
import { IFetchTeacherClassesUseCase } from '../../../../domain/useCase/IFetchTeacherClassesUseCase';

export class FetchTeacherClassesUseCase implements IFetchTeacherClassesUseCase {
  constructor(private readonly teacherRepository: ITeacherRepository) {}

  async execute(teacherId: string): Promise<ClassSubjectDto[]> {
    if (!teacherId) throw new Error('Teacher ID is required');
    return this.teacherRepository.getTeacherClasses(teacherId);
  }
}
