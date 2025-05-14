import { IStudentProfileRepository } from '../../../domain/interface/student/IStudentProfileRepository';
import { ILiveSessionDto } from '../../../domain/types/interfaces';
import { IGetStdSessionsUsecase } from '../../../domain/interface/IGetStdSessionsUsecase';
import { IStudentRepository } from '../../../domain/interface/admin/IStudentRepository';

export class GetStdSessionsUsecase implements IGetStdSessionsUsecase {
  constructor(private studentRepository: IStudentRepository) {}

  async execute(userId: string): Promise<ILiveSessionDto[]| null> {
    try {
      const sessions = await this.studentRepository.getSessions(userId);
      if (!sessions) {
        throw new Error('Student sessions not found');
      }
      return sessions;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch student profile');
    }
  }
}