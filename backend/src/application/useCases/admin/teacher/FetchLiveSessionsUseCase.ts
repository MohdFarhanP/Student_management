import { ITeacherRepository } from '../../../../domain/interface/admin/ITeacherRepository';
import { IFetchLiveSessionsUseCase } from '../../../../domain/interface/IFetchLiveSessionsUseCase';
import { SessionDto } from '../../../../domain/types/interfaces';

export class FetchLiveSessionsUseCase implements IFetchLiveSessionsUseCase  {
  constructor(private readonly teacherRepository: ITeacherRepository) {}

  async execute(teacherId: string): Promise<SessionDto[]> {
    if (!teacherId) throw new Error('Teacher ID is required');
    return this.teacherRepository.getLiveSessions(teacherId);
  }
}