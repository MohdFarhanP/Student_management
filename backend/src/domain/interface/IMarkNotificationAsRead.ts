export interface IMarkNotificationAsRead {
    execute(notificationId: string, userId: string): Promise<void>;
  }