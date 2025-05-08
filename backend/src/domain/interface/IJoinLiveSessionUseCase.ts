import { JoinLiveSessionResponse } from "../../application/useCases/liveSession/JoinLiveSessionUseCase";
import { JoinLiveSessionDTO } from "../types/interfaces";

export interface IJoinLiveSessionUseCase {
    execute(dto: JoinLiveSessionDTO): Promise<JoinLiveSessionResponse>;
  }