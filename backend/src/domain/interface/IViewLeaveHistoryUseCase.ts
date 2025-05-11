import { Leave, ViewLeaveHistoryDTO } from "../types/interfaces";

export interface IViewLeaveHistoryUseCase {
  execute(dto: ViewLeaveHistoryDTO): Promise<Leave[]>;
}
