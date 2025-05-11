import { ApplyForLeaveDTO, Leave } from "../types/interfaces";

export interface IApplyForLeaveUseCase {
  execute(dto: ApplyForLeaveDTO): Promise<Leave>;
}