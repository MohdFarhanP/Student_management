import { IStudentRepository } from '../../../../domain/repositories/IStudentRepository';
import { IGetAllStudentsUseCase } from '../../../../domain/useCase/IGetAllStudentsUseCase';
import { StudentEntity } from '../../../../domain/entities/student';

export class GetAllStudentsUseCase implements IGetAllStudentsUseCase {
  constructor(private studentRepository: IStudentRepository) {}

  async execute(
    page: number,
    limit: number
  ): Promise<{ students: StudentEntity[]; totalCount: number }> {
    try {
      return await this.studentRepository.getAll(page, limit);
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Failed to fetch students');
    }
  }
}
