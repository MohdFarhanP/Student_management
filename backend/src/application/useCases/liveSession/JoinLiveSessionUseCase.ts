import { ILiveSessionRepository } from '../../../domain/interface/ILiveSessionRepository';
import { IVideoService } from '../../../domain/interface/IVideoService';
import { IJoinLiveSessionUseCase } from '../../../domain/interface/IJoinLiveSessionUseCase';
import { ValidationError } from '../../../domain/errors';
import { JoinLiveSessionDTO} from '../../../domain/types/interfaces';
import { SessionStatus } from '../../../domain/types/enums';
export interface JoinLiveSessionResponse {
  roomId: string;
  token: string;
}

export class JoinLiveSession implements IJoinLiveSessionUseCase {
  constructor(
    private liveSessionRepository: ILiveSessionRepository,
    private videoService: IVideoService
  ) {}

  async execute(dto: JoinLiveSessionDTO): Promise<JoinLiveSessionResponse> {
    const session = await this.liveSessionRepository.findById(dto.sessionId);
    if (!session) {
      throw new ValidationError('Live session not found');
    }
    if (session.status !== SessionStatus.Ongoing) {
      throw new ValidationError('Live session is not currently active');
    }
    if (!session.roomId) {
      throw new ValidationError('Room ID not found for this session');
    }

    // Generate Agora token for the participant
    const token = this.videoService.generateToken(session.roomId, dto.participantId);

    // Join the video call (logs the action on the backend)
    await this.videoService.joinSession(session.roomId, dto.participantId);

    return {
      roomId: session.roomId,
      token,
    };
  }
}