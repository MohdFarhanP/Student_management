import { ILiveSessionDto } from '../../application/dtos/liveSessionDtos';
import { StudentEntity } from '../entities/student';
import { IStudent, UserInfo } from '../types/interfaces';

export interface IStudentRepository {
  insertMany(data: StudentEntity[]): Promise<void>;
  getAll(
    page: number,
    limit: number
  ): Promise<{ students: StudentEntity[]; totalCount: number }>;
  findById(id: string): Promise<StudentEntity | null>;
  create(data: Partial<IStudent>): Promise<StudentEntity>;
  update(id: string, data: Partial<IStudent>): Promise<StudentEntity>;
  delete(id: string): Promise<void>;
  getProfile(email: string): Promise<StudentEntity | null>;
  findByEmail(email: string): Promise<StudentEntity | null>;
  getStudentsByClass(classId: string): Promise<StudentEntity[]>;
  addStudentToClass(classId: string, studentId: string): Promise<void>;
  removeStudentFromClass(classId: string, studentId: string): Promise<void>;
  getSessions(userId: string): Promise<ILiveSessionDto[] | null>;
  findManyByIds(ids: string[]): Promise<UserInfo[]>;
  findByPhoneNo(userId: string, phonNo: number): Promise<StudentEntity | null>;
  search(quary: string): Promise<StudentEntity[] | null>;
}
