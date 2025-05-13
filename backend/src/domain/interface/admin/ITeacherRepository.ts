import { ObjectId } from '../../../types/index';
import { Teacher } from '../../entities/teacher';
import { ClassSubjectDto, ITeacher, ScheduleDto, SessionDto } from '../../types/interfaces';

export interface ITeacherRepository {
  insertMany(teachers: Teacher[]): Promise<void>;
  getAllByLimit(page: number, limit: number): Promise<{ data: Teacher[]; totalCount: number }>;
  getAll(): Promise<{ data: Teacher[] }>;
  getById(id: ObjectId | string): Promise<Teacher>;
  save(teacher: Teacher): Promise<void>;
  getByEmail(email: string): Promise<Teacher | null>;
  update(id: string, data: Partial<ITeacher>): Promise<Teacher>;
  create(data: Partial<ITeacher>): Promise<Teacher>;
  delete(id: string): Promise<void>;

  getTeacherClasses(teacherId: string): Promise<ClassSubjectDto[]>;
  getTodaySchedule(teacherId: string): Promise<ScheduleDto[]>;
  getLiveSessions(teacherId: string): Promise<SessionDto[]>;
}