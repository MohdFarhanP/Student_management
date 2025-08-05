import { StudentFeeDue } from '../entities/StudentFeeDue';

export interface IStudentFeeDueRepository {
  createMany(dues: StudentFeeDue[]): Promise<void>;
  findUnpaidByStudentId(studentId: string): Promise<StudentFeeDue[]>;
  IsPaid(feeDueId: string): Promise<boolean>;
  update(feeDue: StudentFeeDue): Promise<void>;
  findByLimit(page:number,limit:number): Promise<{studentFeeDue:StudentFeeDue[];totalCount:number}>;
}
