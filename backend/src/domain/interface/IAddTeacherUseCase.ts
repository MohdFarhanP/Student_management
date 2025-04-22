import { Teacher } from '../entities/teacher';
import { ITeacher } from '../types/interfaces';

export interface IAddTeacherUseCase {
  execute(teacherData: Partial<ITeacher>): Promise<Teacher>;
}