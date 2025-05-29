import { TrackSessionDurationDTO } from '../../application/dtos/liveSessionDtos';

export interface ITrackSessionDurationUseCase {
  execute(dto: TrackSessionDurationDTO): Promise<void>;
}
