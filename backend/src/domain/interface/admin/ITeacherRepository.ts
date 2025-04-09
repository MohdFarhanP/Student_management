import { ObjectId } from '../../../types/index.js';
import { Teacher } from '../../entities/teacher.js';
import { ITeacher } from '../ITeacher.js';

export interface ITeacherRepository {
  insertMany(teachers: Teacher[]): Promise<void>;
  getAllByLimit(
    page: number,
    limit: number
  ): Promise<{ data: Teacher[]; totalCount: number }>;
  getAll(): Promise<{ data: Teacher[] }>;
  getById(id: ObjectId | string): Promise<Teacher>;
  getByEmail(email: string): Promise<Teacher | null>;
  save(teacher: Teacher): Promise<void>;
  update(id: string, data: Partial<ITeacher>): Promise<Teacher>;
  create(data: Partial<ITeacher>): Promise<Teacher>;
  delete(id: string): Promise<void>;
}
