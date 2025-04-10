import { Student } from '../../../../domain/entities/student.js';
import { IStudentRepository } from '../../../../domain/interface/admin/IStudentRepository.js';

export class GetStudentsByClassUseCase {
  constructor(private studentRepository: IStudentRepository) {}

  async execute(classId: string): Promise<Student[]> {
    return this.studentRepository.getStudentsByClass(classId);
  }
}
