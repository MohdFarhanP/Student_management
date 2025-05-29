import { AdminDashboardStats } from '../types/interfaces';

export interface IDashboardRepository {
  getAdminDashboardStats(): Promise<AdminDashboardStats>;
}
