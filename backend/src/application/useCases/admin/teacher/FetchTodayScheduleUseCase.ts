import { ITeacherRepository } from '../../../../domain/interface/admin/ITeacherRepository';
import { IFetchTodayScheduleUseCase } from '../../../../domain/interface/IFetchTodayScheduleUseCase';
import { ScheduleDto } from '../../../../domain/types/interfaces';

export class FetchTodayScheduleUseCase implements IFetchTodayScheduleUseCase {
  constructor(private readonly teacherRepository: ITeacherRepository) {}

  async execute(teacherId: string): Promise<ScheduleDto[]> {
    if (!teacherId) throw new Error('Teacher ID is required');
    return this.teacherRepository.getTodaySchedule(teacherId);
  }
}