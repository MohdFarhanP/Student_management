import { IDashboardRepository } from '../../../domain/repositories/IDashboardRepository';
import { IGetAdminDashboardStatsUseCase } from '../../../domain/useCase/IGetAdminDashboardStatsUseCase';
import { AdminDashboardStats } from '../../../domain/types/interfaces';

export class GetAdminDashboardStatsUseCase
  implements IGetAdminDashboardStatsUseCase
{
  constructor(private dashboardRepository: IDashboardRepository) {}

  async execute(): Promise<AdminDashboardStats> {
    return this.dashboardRepository.getAdminDashboardStats();
  }
}
