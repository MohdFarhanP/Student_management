import { StudentFeeDue } from '../entities/StudentFeeDue';

export interface IStudentFeeDueRepository {
  createMany(dues: StudentFeeDue[]): Promise<void>;
  findUnpaidByStudentId(studentId: string): Promise<StudentFeeDue[]>;
  update(feeDue: StudentFeeDue): Promise<void>;
  findAll(): Promise<StudentFeeDue[]>;
}
