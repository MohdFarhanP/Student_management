import { INotification } from "../types/interfaces";

export interface IGetNotificationsUseCase {
  execute(userId: string): Promise<INotification[]>;
}