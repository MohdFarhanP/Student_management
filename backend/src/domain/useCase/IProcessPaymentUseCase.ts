export interface IProcessPaymentUseCase {
  execute(
    studentId: string,
    feeDueId: string
  ): Promise<{ order: { id: string }; paymentId: string }>;
}
