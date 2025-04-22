import { IStudentRepository } from '../../../../domain/interface/admin/IStudentRepository';
import { IStudent } from '../../../../domain/types/interfaces';
import { Student } from '../../../../domain/entities/student';
import { IEditStudentUseCase } from '../../../../domain/interface/IEditStudentUseCase';
import { Types } from 'mongoose';

export class EditStudentUseCase implements IEditStudentUseCase {
  constructor(private studentRepository: IStudentRepository) {}

  async execute(studentId: string, studentData: Partial<IStudent>): Promise<Student> {
    try {
      if (!Types.ObjectId.isValid(studentId)) {
        throw new Error('Invalid student ID');
      }
      const updatedStudent = await this.studentRepository.update(studentId, studentData);
      if (!updatedStudent) {
        throw new Error('Student not found');
      }
      return updatedStudent;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to update student');
    }
  }
}