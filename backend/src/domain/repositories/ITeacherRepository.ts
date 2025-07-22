import { ObjectId } from '../types/common';
import { TeacherEntity } from '../entities/teacher';
import { ITeacher } from '../types/interfaces';
import { ClassSubjectDto } from '../../application/dtos/classDtos';
import {
  ScheduleDto,
  SessionDto,
} from '../../application/dtos/liveSessionDtos';

export interface ITeacherRepository {
  insertMany(teachers: TeacherEntity[]): Promise<void>;
  getAllByLimit(
    page: number,
    limit: number
  ): Promise<{ data: TeacherEntity[]; totalCount: number }>;
  getAll(): Promise<{ data: TeacherEntity[] }>;
  getById(id: ObjectId | string): Promise<TeacherEntity>;
  save(teacher: TeacherEntity): Promise<void>;
  getByEmail(email: string): Promise<TeacherEntity | null>;
  update(id: string, data: Partial<ITeacher>): Promise<TeacherEntity>;
  create(data: Partial<ITeacher>): Promise<TeacherEntity>;
  delete(id: string): Promise<void>;
  getTeacherClasses(teacherId: string): Promise<ClassSubjectDto[]>;
  getTodaySchedule(teacherId: string): Promise<ScheduleDto[]>;
  getLiveSessions(teacherId: string): Promise<SessionDto[]>;
  search(quary: string): Promise<TeacherEntity[] | null>;
}
