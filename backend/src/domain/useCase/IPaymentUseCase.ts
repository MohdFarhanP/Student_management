import { StudentFeeDue } from '../types/interfaces';

export interface IPaymentUseCase {
  exicute(
    page: number,
    limit: number
  ): Promise<{ duesDto: StudentFeeDue[]; totalCount: number }>;
}
