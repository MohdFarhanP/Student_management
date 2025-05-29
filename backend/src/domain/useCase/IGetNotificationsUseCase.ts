import { INotification } from '../types/interfaces';

export interface IGetNotificationsUseCase {
  execute(userId: string, userRole: string): Promise<INotification[]>;
}
