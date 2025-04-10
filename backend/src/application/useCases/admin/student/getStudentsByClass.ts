import { Student } from '../../../../domain/entities/student.js';
import { StudentRepository } from '../../../../infrastructure/repositories/admin/studentRepository.js';

export class GetStudentsByClassUseCase {
  constructor(private studentRepository: StudentRepository) {}

  async execute(classId: string): Promise<Student[]> {
    return this.studentRepository.getStudentsByClass(classId);
  }
}