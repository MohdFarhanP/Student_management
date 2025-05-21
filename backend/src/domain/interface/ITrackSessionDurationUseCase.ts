import { TrackSessionDurationDTO } from "../types/interfaces";

export interface ITrackSessionDurationUseCase {
    execute(dto: TrackSessionDurationDTO): Promise<void>
}