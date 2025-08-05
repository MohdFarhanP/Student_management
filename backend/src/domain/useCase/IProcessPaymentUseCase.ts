export interface IProcessPaymentUseCase {
  execute(studentId: string, feeDueId: string): Promise<string>;
}
