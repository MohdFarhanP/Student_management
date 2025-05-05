export interface INotificationScheduler {
  start(): void;
  stop(): void;
  processNow(): void;
}