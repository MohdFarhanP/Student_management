import { JoinLiveSessionResponse } from '../../application/dtos/liveSessionDtos';
import { JoinLiveSessionDTO } from '../../application/dtos/liveSessionDtos';

export interface IJoinLiveSessionUseCase {
  execute(dto: JoinLiveSessionDTO): Promise<JoinLiveSessionResponse>;
}
