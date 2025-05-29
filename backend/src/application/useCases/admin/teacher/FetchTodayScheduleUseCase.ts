import { ITeacherRepository } from '../../../../domain/repositories/ITeacherRepository';
import { IFetchTodayScheduleUseCase } from '../../../../domain/useCase/IFetchTodayScheduleUseCase';
import { ScheduleDto } from '../../../dtos/liveSessionDtos';

export class FetchTodayScheduleUseCase implements IFetchTodayScheduleUseCase {
  constructor(private readonly teacherRepository: ITeacherRepository) {}

  async execute(teacherId: string): Promise<ScheduleDto[]> {
    if (!teacherId) throw new Error('Teacher ID is required');
    return this.teacherRepository.getTodaySchedule(teacherId);
  }
}
