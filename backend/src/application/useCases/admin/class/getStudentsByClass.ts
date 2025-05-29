import { StudentEntity } from '../../../../domain/entities/student';
import { IStudentRepository } from '../../../../domain/repositories/IStudentRepository';
import { IGetStudentsByClassUseCase } from '../../../../domain/useCase/IGetStudentsByClassUseCase';

export class GetStudentsByClassUseCase implements IGetStudentsByClassUseCase {
  constructor(private studentRepository: IStudentRepository) {}

  async execute(classId: string): Promise<StudentEntity[]> {
    try {
      return await this.studentRepository.getStudentsByClass(classId);
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Failed to fetch students by class');
    }
  }
}
