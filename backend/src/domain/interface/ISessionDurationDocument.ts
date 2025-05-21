export interface ISessionDurationDocument extends Document {
  userId: string;
  sessionId: string;
  durationSeconds: number;
  joinTime: Date;
  leaveTime: Date;
}