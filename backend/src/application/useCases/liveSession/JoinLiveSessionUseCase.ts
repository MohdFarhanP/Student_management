import { ILiveSessionRepository } from '../../../domain/interface/ILiveSessionRepository';
import { IVideoService } from '../../../domain/interface/IVideoService';
import { IJoinLiveSessionUseCase } from '../../../domain/interface/IJoinLiveSessionUseCase';
import { ValidationError } from '../../../domain/errors';
import { JoinLiveSessionDTO, UserInfo} from '../../../domain/types/interfaces';
import { SessionStatus } from '../../../domain/types/enums';


export interface JoinLiveSessionResponse {
  roomId: string;
  token: string;
  participants?: UserInfo[]; // Add participants to the response
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

    // Verify the user is allowed to join
    const isTeacher = dto.participantId === session.teacherId;
    const isStudent = session.studentIds.includes(dto.participantId);
    if (!isTeacher && !isStudent) {
      throw new ValidationError('User is not authorized to join this session');
    }

    // Generate Agora token for the participant
    const token = this.videoService.generateToken(session.roomId, dto.participantId);

    // Join the video call (logs the action on the backend)
    await this.videoService.joinSession(session.roomId, dto.participantId);

    // Add the user to the participants list
    const newParticipant: UserInfo = {
      id: dto.participantId,
      email: `user-${dto.participantId}@example.com`, // Ideally, fetch from a user service
      role: isTeacher ? 'Teacher' : 'Student',
    };

    const currentParticipants = Array.isArray(session.participants) ? session.participants : [];
    if (!currentParticipants.some((p: UserInfo) => p.id === newParticipant.id)) {
      currentParticipants.push(newParticipant);
      await this.liveSessionRepository.update(dto.sessionId, { participants: currentParticipants });
    }

    // Fetch the updated session to get the latest participants list
    const updatedSession = await this.liveSessionRepository.findById(dto.sessionId);
    const participants: UserInfo[] = updatedSession?.participants?.map((participant: any) => ({
      id: participant.id,
      email: participant.email || `user-${participant.id}@example.com`,
      role: participant.role || 'Unknown',
    })) || [];

    return {
      roomId: session.roomId,
      token,
      participants, 
    };
  }
}