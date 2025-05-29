import { ILiveSessionDto } from '../../dtos/liveSessionDtos';
import { IGetStdSessionsUsecase } from '../../../domain/useCase/IGetStdSessionsUsecase';
import { IStudentRepository } from '../../../domain/repositories/IStudentRepository';

export class GetStdSessionsUsecase implements IGetStdSessionsUsecase {
  constructor(private studentRepository: IStudentRepository) {}

  async execute(userId: string): Promise<ILiveSessionDto[] | null> {
    try {
      const sessions = await this.studentRepository.getSessions(userId);
      if (!sessions) {
        throw new Error('Student sessions not found');
      }
      return sessions;
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Failed to fetch student profile');
    }
  }
}
