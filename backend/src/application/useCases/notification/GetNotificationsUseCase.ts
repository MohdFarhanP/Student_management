import { INotification } from "../../../domain/interface/INotification";
import { INotificationRepository } from "../../../domain/interface/INotificationRepository";


export class GetNotificationsUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute(userId: string): Promise<INotification[]> {
    const now = new Date().toISOString(); // Current time in ISO string for comparison
    const allNotifications = await this.notificationRepository.findByUserId(userId);
    console.log('All notifications fetched:', allNotifications);

    // Filter notifications where scheduledAt is undefined or <= now
    const filteredNotifications = allNotifications.filter(
      (notification) =>
        !notification.scheduledAt || notification.scheduledAt <= now
    );
    console.log('Filtered notifications:', filteredNotifications);

    return filteredNotifications;
  }
}