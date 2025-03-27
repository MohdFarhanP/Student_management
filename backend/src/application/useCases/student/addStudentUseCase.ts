import { StudentRepository } from '../../../infrastructure/repositories/studentRepository.js';
import { IStudent } from '../../../domain/interface/IStudent.js';
import { Student } from '../../../domain/entities/student.js';

export class AddStudentUseCase {
  constructor(private studentRepository: StudentRepository) {}

  async execute(studentData: Partial<IStudent>): Promise<Student> {
    return await this.studentRepository.create(studentData);
  }
}
