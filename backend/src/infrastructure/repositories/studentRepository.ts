import { studentModel } from '../database/models/studentModel.js';
import { IRepository } from '../../domain/interface/IRepository.js';
import { Student } from '../../domain/entities/student.js';

export class StudentRepository implements IRepository<Student> {
  async insertMany(students: Student[]) {
    console.log('Inserting Students:', students);

    if (!students || students.length === 0) {
      console.log('No students to insert');
      return;
    }

    await studentModel.insertMany(students);
    console.log('Students successfully inserted');
  }
}
