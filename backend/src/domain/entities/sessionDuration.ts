export class SessionDuration {
    constructor(
        public userId:string,
        public sessionId: string,
        public durationSeconds: number,
        public joinTime: Date,
        public leaveTime: Date,
    ){}

    validate(): void {
    if (this.durationSeconds < 0) {
      throw new Error('Duration cannot be negative');
    }
    if (this.leaveTime < this.joinTime) {
      throw new Error('Leave time cannot be before join time');
    }
  }
}