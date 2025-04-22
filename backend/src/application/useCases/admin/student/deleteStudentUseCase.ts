import { IStudentRepository } from '../../../../domain/interface/admin/IStudentRepository';
import { IDeleteStudentUseCase } from '../../../../domain/interface/IDeleteStudentUseCase';
import { Types } from 'mongoose';

export class DeleteStudentUseCase implements IDeleteStudentUseCase {
  constructor(private studentRepository: IStudentRepository) {}

  async execute(studentId: string): Promise<void> {
    try {
      if (!Types.ObjectId.isValid(studentId)) {
        throw new Error('Invalid student ID');
      }
      await this.studentRepository.delete(studentId);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to delete student');
    }
  }
}