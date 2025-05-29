import Razorpay from 'razorpay';
import { IPaymentGateway } from '../../application/services/IPaymentGateway';

export class RazorpayAdapter implements IPaymentGateway {
  private razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  async createOrder(amount: number, receipt: string): Promise<{ id: string }> {
    try {
      const order = await this.razorpay.orders.create({
        amount,
        currency: 'INR',
        receipt,
      });
      return { id: order.id };
    } catch (error: any) {
      throw new Error(`Failed to create Razorpay order: ${error.message}`);
    }
  }
}
