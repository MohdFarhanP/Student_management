import { ScheduleLiveSessionDTO } from '../../application/dtos/liveSessionDtos';
import { ILiveSession } from '../types/interfaces';

export interface IScheduleLiveSessionUseCase {
  execute(dto: ScheduleLiveSessionDTO): Promise<ILiveSession>;
}
