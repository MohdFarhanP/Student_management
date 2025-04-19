import { StudentRepository } from '../../../../infrastructure/repositories/admin/studentRepository';
import { Types } from 'mongoose';

export class DeleteStudentUseCase {
  constructor(private studentRepository: StudentRepository) {}

  async execute(studentId: string): Promise<void> {
    if (!Types.ObjectId.isValid(studentId))
      throw new Error('Invalid student ID');
    await this.studentRepository.delete(studentId);
  }
}
