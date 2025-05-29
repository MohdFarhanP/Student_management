import { ViewLeaveHistoryDTO } from '../../application/dtos/leaveDtos';
import { Leave } from '../types/interfaces';

export interface IViewLeaveHistoryUseCase {
  execute(dto: ViewLeaveHistoryDTO): Promise<Leave[]>;
}
