import { SessionStatus } from "../types/enums";
import { ILiveSession, UserInfo } from "../types/interfaces";

export class LiveSession implements ILiveSession {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly classId: string,
    public readonly teacherId: string,
    public readonly studentIds: string[],
    public readonly scheduledAt: Date,
    public readonly status: SessionStatus,
    public readonly roomId: string | undefined,
    public readonly token: string | undefined,
    public readonly participants: UserInfo[] | undefined,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  // Business rule: Validate the session
  validate(): void {
    if (!this.teacherId) {
      throw new Error('Teacher ID is required');
    }
    if (this.status === SessionStatus.Scheduled && this.scheduledAt < new Date()) {
      throw new Error('Scheduled time cannot be in the past for a Scheduled session');
    }
    const validStatuses = Object.values(SessionStatus);
    if (!validStatuses.includes(this.status)) {
      throw new Error(`Invalid status: ${this.status}`);
    }
  }
}