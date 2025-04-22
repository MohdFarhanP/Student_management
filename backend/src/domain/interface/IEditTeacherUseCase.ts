import { Teacher } from '../entities/teacher';
import { ITeacher } from '../types/interfaces';

export interface IEditTeacherUseCase {
  execute(teacherId: string, teacherData: Partial<ITeacher>): Promise<Teacher>;
}