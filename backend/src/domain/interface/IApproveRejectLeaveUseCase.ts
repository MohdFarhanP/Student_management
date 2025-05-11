import { ApproveRejectLeaveDTO, Leave } from "../types/interfaces";

export interface IApproveRejectLeaveUseCase {
  execute(dto: ApproveRejectLeaveDTO): Promise<Leave>;
}