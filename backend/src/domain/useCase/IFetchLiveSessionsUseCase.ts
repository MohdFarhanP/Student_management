import { SessionDto } from '../../application/dtos/liveSessionDtos';

export interface IFetchLiveSessionsUseCase {
  execute(teacherId: string): Promise<SessionDto[]>;
}
