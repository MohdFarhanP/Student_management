import { Student } from '../../../../domain/entities/student';
import { IStudentRepository } from '../../../../domain/interface/admin/IStudentRepository';

export class GetStudentsByClassUseCase {
  constructor(private studentRepository: IStudentRepository) {}

  async execute(classId: string): Promise<Student[]> {
    return this.studentRepository.getStudentsByClass(classId);
  }
}
