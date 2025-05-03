import { IGetClassForStudentUseCase } from '../../../domain/interface/IGetClassForStudentUseCase';
import { IClassRepository } from '../../../domain/interface/admin/IClassRepository';
import { IClass } from '../../../domain/types/interfaces';
import { ForbiddenError, NotFoundError } from '../../../domain/errors';
import { Role } from '../../../domain/types/enums';

export class GetClassForStudentUseCase implements IGetClassForStudentUseCase {
  constructor(private classRepository: IClassRepository) {}

  async execute(studentId: string, role: string): Promise<Partial<IClass> | null> {
    if (role !== Role.Student) {
      throw new ForbiddenError('Only students can access this endpoint');
    }
    const classDoc = await this.classRepository.getClassForStudent(studentId);
    if (!classDoc) {
      throw new NotFoundError('No class found for this student');
    }
    return classDoc;
  }
}