import { IDashboardRepository } from "../../../domain/interface/IDashboardRepository";
import { IGetAdminDashboardStatsUseCase } from "../../../domain/interface/IGetAdminDashboardStatsUseCase";
import { AdminDashboardStats } from "../../../domain/types/interfaces";

export class GetAdminDashboardStatsUseCase implements IGetAdminDashboardStatsUseCase {
  constructor(private dashboardRepository: IDashboardRepository) {}

  async execute(): Promise<AdminDashboardStats> {
    return this.dashboardRepository.getAdminDashboardStats();
  }
}