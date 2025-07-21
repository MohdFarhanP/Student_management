import { IVideoService } from '../../application/services/IVideoService';
import { v4 as uuidv4 } from 'uuid';
import { RtcTokenBuilder, RtcRole } from 'agora-token';
import logger from '../../logger';

export class AgoraVideoService implements IVideoService {
  private appId: string;
  private appCertificate: string;

  constructor() {
    this.appId = process.env.AGORA_APP_ID || '';
    this.appCertificate = process.env.AGORA_APP_CERTIFICATE || '';
    if (!this.appId || !this.appCertificate) {
      throw new Error(
        'AGORA_APP_ID and AGORA_APP_CERTIFICATE must be set in environment variables'
      );
    }
  }

  generateRoomId(): string {
    return `room-${uuidv4()}`;
  }

  generateToken(roomId: string, participantId: string): string {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const expirationTimeInSeconds = 3600; // Token expires in 1 hour
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    logger.debug('Generating Agora token with:', {
      appId: this.appId,
      appCertificate: this.appCertificate,
      channelName: roomId,
      uid: participantId,
      role: RtcRole.PUBLISHER,
      tokenExpire: expirationTimeInSeconds,
      privilegeExpiredTs,
    });

    const token = RtcTokenBuilder.buildTokenWithUserAccount(
      this.appId,
      this.appCertificate,
      roomId,
      participantId,
      RtcRole.PUBLISHER,
      expirationTimeInSeconds, // 6th argument: tokenExpire
      privilegeExpiredTs // 7th argument: privilegeExpiredTs
    );

    logger.debug('Generated Agora Token:', token);
    return token;
  }

  async startSession(roomId: string): Promise<void> {
    logger.info(`Starting video session in room ${roomId}`);
  }

  async joinSession(roomId: string, participantId: string): Promise<void> {
    logger.info(`Participant ${participantId} joined room ${roomId}`);
  }

  async endSession(roomId: string): Promise<void> {
    logger.info(`Ending video session in room ${roomId}`);
  }
}
