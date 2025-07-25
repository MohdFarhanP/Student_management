import { ITeacherRepository } from '../../../../domain/repositories/ITeacherRepository';
import { IDeleteTeacherUseCase } from '../../../../domain/useCase/IDeleteTeacherUseCase';
import { Types } from 'mongoose';

export class DeleteTeacherUseCase implements IDeleteTeacherUseCase {
  constructor(private teacherRepository: ITeacherRepository) {}

  async execute(teacherId: string): Promise<void> {
    try {
      if (!Types.ObjectId.isValid(teacherId)) {
        throw new Error('Invalid teacher ID');
      }
      const existingTeacher = await this.teacherRepository.getById(teacherId);
      if (!existingTeacher) {
        throw new Error('Teacher not found');
      }
      await this.teacherRepository.delete(teacherId);
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Failed to delete teacher');
    }
  }
}
