  import { IVideoService } from '../../domain/interface/IVideoService';
  import { v4 as uuidv4 } from 'uuid';
  import { RtcTokenBuilder, RtcRole } from 'agora-token';

  export class AgoraVideoService implements IVideoService {
    private appId: string;
    private appCertificate: string;

    constructor() {
      this.appId = process.env.AGORA_APP_ID || '';
      this.appCertificate = process.env.AGORA_APP_CERTIFICATE || '';
      if (!this.appId || !this.appCertificate) {
        throw new Error('AGORA_APP_ID and AGORA_APP_CERTIFICATE must be set in environment variables');
      }
    }

    generateRoomId(): string {
      return `room-${uuidv4()}`;
    }

    generateToken(roomId: string, participantId: string): string {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const expirationTimeInSeconds = 3600; // Token expires in 1 hour
      const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

      // Use buildTokenWithUserAccount and provide all 7 arguments
      return RtcTokenBuilder.buildTokenWithUserAccount(
        this.appId,
        this.appCertificate,
        roomId,
        participantId, // participantId as a string
        RtcRole.PUBLISHER,
        expirationTimeInSeconds, // tokenExpire (duration in seconds)
        privilegeExpiredTs // privilegeExpiredTs (timestamp in seconds)
      );
    }

    async startSession(roomId: string): Promise<void> {
      console.log(`Starting video session in room ${roomId}`);
    }

    async joinSession(roomId: string, participantId: string): Promise<void> {
      console.log(`Participant ${participantId} joined room ${roomId}`);
    }

    async endSession(roomId: string): Promise<void> {
      console.log(`Ending video session in room ${roomId}`);
    }
  }