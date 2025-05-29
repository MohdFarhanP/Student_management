import { ApproveRejectLeaveDTO } from '../../application/dtos/leaveDtos';
import { Leave } from '../types/interfaces';

export interface IApproveRejectLeaveUseCase {
  execute(dto: ApproveRejectLeaveDTO): Promise<Leave>;
}
