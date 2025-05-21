import { ILiveSession } from '../types/interfaces';

export interface ILiveSessionRepository {
  save(session: ILiveSession): Promise<ILiveSession>;
  findById(id: string): Promise<ILiveSession | null>;
  updateStatus(id: string, status: string): Promise<void>;
  update(id: string, updates: Partial<ILiveSession>): Promise<void>;
  findByTeacherId(teacherId: string): Promise<ILiveSession[]>;
  findByStudentId(studentId: string): Promise<ILiveSession[]>;
  findSessionByTeacherId(teacherId: string, limit: number): Promise<ILiveSession[]>

}