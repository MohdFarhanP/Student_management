import { INotification } from '../types/interfaces';
import { SendNotificationDTO } from '../types/interfaces';

export interface ISendNotificationUseCase {
  execute(notification: SendNotificationDTO): Promise<INotification>;
  
}