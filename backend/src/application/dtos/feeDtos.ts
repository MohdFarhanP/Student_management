export interface IRecurringFeeDto {
  id: string;
  title: string;
  amount: number;
  startMonth: string;
  endMonth: string;
  classId: string;
  className: string;
  recurring: boolean;
}
