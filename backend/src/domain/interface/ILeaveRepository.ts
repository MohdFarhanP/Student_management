import { Leave } from "../types/interfaces";

export interface ILeaveRepository {
  create(leave: Omit<Leave, 'id' | 'createdAt' | 'updatedAt'>): Promise<Leave>;
  findByStudentId(studentId: string): Promise<Leave[]>;
  findById(id: string): Promise<Leave | null>;
  update(id: string, data: Partial<Leave>): Promise<Leave>;
}