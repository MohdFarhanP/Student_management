import { ILiveSessionDto } from '../../application/dtos/liveSessionDtos';

export interface IGetStdSessionsUsecase {
  execute(userId: string): Promise<ILiveSessionDto[] | null>;
}
