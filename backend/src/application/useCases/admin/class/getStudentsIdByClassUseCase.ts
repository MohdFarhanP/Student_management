import { IStudentRepository } from '../../../../domain/interface/admin/IStudentRepository';
import { IGetStudentsIdByClassUseCase } from '../../../../domain/interface/IGetStudentsIdByClassUseCase';
import { StudentIdsDTO } from '../../../../domain/types/interfaces';

export class getStudentsIdByClassUseCase implements IGetStudentsIdByClassUseCase {
  constructor(private studentRepository: IStudentRepository) {}

  async execute(classId: string): Promise<StudentIdsDTO> {
    try {
      const students = await this.studentRepository.getStudentsByClass(classId);
      const studentIds = students.map((student) => student.id!); // Use `id` from the Student entity
      return { studentIds };
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch student IDs by class');
    }
  }
}