import { SendNotificationDTO } from '../../application/dtos/notificationDtos';
import { INotification } from '../types/interfaces';

export interface ISendNotificationUseCase {
  execute(notification: SendNotificationDTO): Promise<INotification>;
}
