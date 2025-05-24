export interface IPaymentGateway {
  createOrder(amount: number, receipt: string): Promise<{ id: string }>;
}