export interface IMarkNotificationAsRead {
  execute(
    notificationId: string,
    userId: string,
    userRole: string
  ): Promise<void>;
}
