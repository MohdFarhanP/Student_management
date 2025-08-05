import Razorpay from 'razorpay';
import { IPaymentGateway } from '../../application/services/IPaymentGateway';
import crypto from 'crypto';

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
  async verifyPayment(
    orderId: string,
    paymentId: string,
    signature: string
  ): Promise<boolean> {
    try {
      const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(orderId + '|' + paymentId)
        .digest('hex');
      return generated_signature === signature;
    } catch (error: any) {
      throw new Error(`Failed to verify Razorpay payment: ${error.message}`);
    }
  }
}
