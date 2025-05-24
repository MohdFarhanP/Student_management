import { RecurringFee } from "../entities/RecurringFee";

export interface IRecurringFeeRepository {
  create(fee: RecurringFee): Promise<void>;
  findActiveFees(currentMonth: string): Promise<RecurringFee[]>;
  findAll(): Promise<RecurringFee[]>;
}