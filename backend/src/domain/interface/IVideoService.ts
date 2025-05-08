export interface IVideoService {
    generateRoomId(): string; 
    generateToken(roomId: string, participantId: string): string;
    startSession(roomId: string): Promise<void>;
    joinSession(roomId: string, participantId: string): Promise<void>;
    endSession(roomId: string): Promise<void>;
  }