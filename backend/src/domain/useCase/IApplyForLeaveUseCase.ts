import { ApplyForLeaveDTO } from '../../application/dtos/leaveDtos';
import { Leave } from '../types/interfaces';

export interface IApplyForLeaveUseCase {
  execute(dto: ApplyForLeaveDTO): Promise<Leave>;
}
