import { IGetClassesForTeacherUseCase } from '../../../domain/useCase/IGetClassesForTeacherUseCase';
import { IClassRepository } from '../../../domain/repositories/IClassRepository';
import { IClass } from '../../../domain/types/interfaces';
import { ForbiddenError } from '../../../domain/errors';
import { Role } from '../../../domain/types/enums';

export class GetClassesForTeacherUseCase
  implements IGetClassesForTeacherUseCase
{
  constructor(private classRepository: IClassRepository) {}

  async execute(teacherId: string, role: string): Promise<Partial<IClass>[]> {
    if (role !== Role.Teacher) {
      throw new ForbiddenError('Only teachers can access this endpoint');
    }
    return await this.classRepository.getClassesForTeacher(teacherId);
  }
}
