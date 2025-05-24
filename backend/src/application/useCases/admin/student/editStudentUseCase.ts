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

    const existingStudent = await this.studentRepository.findById(studentId);
    if (!existingStudent) {
      throw new Error('Student not found');
    }

    const existingPhonNo = await this.studentRepository.findByPhoneNo(studentId, studentData.address.phoneNo);
    if (existingPhonNo) {
      throw new Error('Student already exist whith the same phonNo');
    }

    const updatedStudent = await this.studentRepository.update(studentId, studentData);
    if (!updatedStudent) {
      throw new Error('Student not found');
    }
    
    const oldClassId = existingStudent.class?.toString();
    const newClassId = studentData.class?.toString();

    if (oldClassId && newClassId && oldClassId !== newClassId) {
      await this.studentRepository.removeStudentFromClass(oldClassId, studentId);
      await this.studentRepository.addStudentToClass(newClassId, studentId);
    }

      return updatedStudent;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to update student');
    }
  }
}