import { SessionDuration } from '../../../domain/entities/sessionDuration';
import { ISessionDurationRepository } from '../../../domain/repositories/ISessionDurationRepository';
import { TrackSessionDurationDTO } from '../../dtos/liveSessionDtos';
import { DomainError } from '../../../domain/errors';
import { ITrackSessionDurationUseCase } from '../../../domain/useCase/ITrackSessionDurationUseCase';

export class TrackSessionDurationUseCase
  implements ITrackSessionDurationUseCase
{
  constructor(
    private readonly sessionDurationRepository: ISessionDurationRepository
  ) {}

  async execute(dto: TrackSessionDurationDTO): Promise<void> {
    const sessionDuration = new SessionDuration(
      dto.userId,
      dto.sessionId,
      dto.durationSeconds,
      dto.joinTime,
      dto.leaveTime
    );

    try {
      sessionDuration.validate();
    } catch (error) {
      throw new DomainError(
        `Invalid session duration data: ${(error as Error).message}`
      );
    }

    await this.sessionDurationRepository.save(sessionDuration);
  }
}
