import { SessionDuration } from "../entities/sessionDuration";


export interface ISessionDurationRepository {
  save(sessionDuration: SessionDuration): Promise<void>;
  findBySessionId(sessionId: string): Promise<SessionDuration[]>;
}