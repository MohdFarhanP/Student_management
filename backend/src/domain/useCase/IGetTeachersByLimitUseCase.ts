import { TeacherEntity as Teacher } from '../entities/teacher';

export interface IGetTeachersByLimitUseCase {
  execute(
    page: number,
    limit: number
  ): Promise<{ teachers: Teacher[]; totalCount: number }>;
}
