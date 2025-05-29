import { AdminDashboardStats } from '../types/interfaces';

export interface IGetAdminDashboardStatsUseCase {
  execute(): Promise<AdminDashboardStats>;
}
