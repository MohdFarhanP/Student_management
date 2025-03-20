import { teacherModel } from '../database/models/teacherModel.js';
import { IRepository } from '../../domain/interface/IRepository.js';
import { Teacher } from '../../domain/entities/teacher.js';

export class TeacherRepository implements IRepository<Teacher> {
  async insertMany(teachers: Teacher[]) {
    console.log('Inserting Teachers:', teachers);

    if (!teachers || teachers.length === 0) {
      console.log('No teachers to insert');
      return;
    }

    await teacherModel.insertMany(teachers);
    console.log('Teachers successfully inserted');
  }
}
