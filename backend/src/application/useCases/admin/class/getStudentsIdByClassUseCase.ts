import { IStudentRepository } from '../../../../domain/repositories/IStudentRepository';
import { IGetStudentsIdByClassUseCase } from '../../../../domain/useCase/IGetStudentsIdByClassUseCase';
import { StudentIdsDTO } from '../../../dtos/studentDtos';

export class getStudentsIdByClassUseCase
  implements IGetStudentsIdByClassUseCase
{
  constructor(private studentRepository: IStudentRepository) {}

  async execute(classId: string): Promise<StudentIdsDTO> {
    try {
      const students = await this.studentRepository.getStudentsByClass(classId);
      const studentIds = students.map((student) => student.id!);
      return { studentIds };
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Failed to fetch student IDs by class');
    }
  }
}
