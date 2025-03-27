import { StudentRepository } from '../../../infrastructure/repositories/studentRepository.js';
import { IStudent } from '../../../domain/interface/IStudent.js';
import { Student } from '../../../domain/entities/student.js';
import { Types } from 'mongoose';

export class EditStudentUseCase {
  constructor(private studentRepository: StudentRepository) {}

  async execute(
    studentId: string,
    studentData: Partial<IStudent>
  ): Promise<Student> {
    if (!Types.ObjectId.isValid(studentId))
      throw new Error('Invalid student ID');
    return await this.studentRepository.update(studentId, studentData);
  }
}
