import { Student } from '../../../../domain/entities/student';
import { IStudentRepository } from '../../../../domain/interface/admin/IStudentRepository';
import { IGetStudentsByClassUseCase } from '../../../../domain/interface/IGetStudentsByClassUseCase';

export class GetStudentsByClassUseCase implements IGetStudentsByClassUseCase {
  constructor(private studentRepository: IStudentRepository) {}

  async execute(classId: string): Promise<Student[]> {
    try {
      return await this.studentRepository.getStudentsByClass(classId);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch students by class');
    }
  }
}