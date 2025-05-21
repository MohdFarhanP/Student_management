import { SessionDuration } from '../../../domain/entities/sessionDuration';
import { ISessionDurationRepository } from '../../../domain/interface/ISessionDurationRepository';
import { TrackSessionDurationDTO } from '../../../domain/types/interfaces';
import { DomainError } from '../../../domain/errors';
import { ITrackSessionDurationUseCase } from '../../../domain/interface/ITrackSessionDurationUseCase';

export class TrackSessionDurationUseCase implements ITrackSessionDurationUseCase {
  constructor(
    private readonly sessionDurationRepository: ISessionDurationRepository
  ) {}

  async execute(dto: TrackSessionDurationDTO): Promise<void> {
    // Create a new SessionDuration entity
    const sessionDuration = new SessionDuration(
      dto.userId,
      dto.sessionId,
      dto.durationSeconds,
      dto.joinTime,
      dto.leaveTime
    );

    // Validate the entity
    try {
      sessionDuration.validate();
    } catch (error) {
      throw new DomainError(`Invalid session duration data: ${(error as Error).message}`);
    }

    // Save to the repository
    await this.sessionDurationRepository.save(sessionDuration);
  }
}