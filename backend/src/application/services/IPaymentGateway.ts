export interface IPaymentGateway {
  createOrder(amount: number, receipt: string): Promise<{ id: string }>;
  verifyPayment(
    orderId: string,
    paymentId: string,
    signature: string
  ): Promise<boolean>;
}
