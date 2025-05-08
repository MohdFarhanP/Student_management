import { ILiveSession, ScheduleLiveSessionDTO } from '../types/interfaces';


export interface IScheduleLiveSessionUseCase {
  execute(dto: ScheduleLiveSessionDTO): Promise<ILiveSession>;
}