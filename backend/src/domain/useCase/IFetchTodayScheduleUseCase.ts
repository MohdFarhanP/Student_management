import { ScheduleDto } from '../../application/dtos/liveSessionDtos';

export interface IFetchTodayScheduleUseCase {
  execute(teacherId: string): Promise<ScheduleDto[]>;
}
