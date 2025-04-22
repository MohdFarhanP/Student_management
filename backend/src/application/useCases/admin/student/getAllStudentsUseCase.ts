import { IStudentRepository } from '../../../../domain/interface/admin/IStudentRepository';
import { IGetAllStudentsUseCase } from '../../../../domain/interface/IGetAllStudentsUseCase';
import { Student } from '../../../../domain/entities/student';

export class GetAllStudentsUseCase implements IGetAllStudentsUseCase {
  constructor(private studentRepository: IStudentRepository) {}

  async execute(page: number, limit: number): Promise<{ students: Student[]; totalCount: number }> {
    try {
      return await this.studentRepository.getAll(page, limit);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch students');
    }
  }
}