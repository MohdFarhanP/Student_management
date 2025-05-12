import { Student } from '../../entities/student';
import { IStudent } from '../../types/interfaces';

export interface IStudentRepository {
  insertMany(data: Student[]): Promise<void>;
  getAll(
    page: number,
    limit: number
  ): Promise<{ students: Student[]; totalCount: number }>;
  findById(id: string): Promise<Student | null>;
  create(data: Partial<IStudent>): Promise<Student>;
  update(id: string, data: Partial<IStudent>): Promise<Student>;
  delete(id: string): Promise<void>;
  getProfile(email: string): Promise<Student | null>;
  findByEmail(email: string): Promise<Student | null>;
  getStudentsByClass(classId: string): Promise<Student[]>;
  addStudentToClass(classId: string, studentId: string): Promise<void>;
  removeStudentFromClass(classId: string, studentId: string): Promise<void>;
  
  // findAll(): Promise<IStudent[]>;
  // findById(id: string): Promise<IStudent | null>;
  
  // create(student: IStudent): Promise<IStudent>;
  // update(id: string, student: Partial<IStudent>): Promise<IStudent | null>;
  // delete(id: string): Promise<void>;
}
