import { Student } from '../../entities/student';
import { ILiveSessionDto, IStudent, UserInfo } from '../../types/interfaces';

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
  getSessions(userId: string): Promise< ILiveSessionDto[] | null>;
  findManyByIds(ids: string[]): Promise<UserInfo[]>
  findByPhoneNo(userId: string ,phonNo: number): Promise<Student | null>
}
  
