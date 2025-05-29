import { ITeacherRepository } from '../../../../domain/repositories/ITeacherRepository';
import { IFetchLiveSessionsUseCase } from '../../../../domain/useCase/IFetchLiveSessionsUseCase';
import { SessionDto } from '../../../dtos/liveSessionDtos';

export class FetchLiveSessionsUseCase implements IFetchLiveSessionsUseCase {
  constructor(private readonly teacherRepository: ITeacherRepository) {}

  async execute(teacherId: string): Promise<SessionDto[]> {
    if (!teacherId) throw new Error('Teacher ID is required');
    return this.teacherRepository.getLiveSessions(teacherId);
  }
}
