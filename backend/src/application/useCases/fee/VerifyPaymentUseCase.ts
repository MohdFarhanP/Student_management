import { Payment } from "../../../domain/entities/Payment";
import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
import { IStudentFeeDueRepository } from "../../../domain/repositories/IStudentFeeDueRepository";
import { IPaymentGateway } from "../../services/IPaymentGateway";

export class VerifyPaymentUseCase implements IVerifyPaymentUseCase {
  constructor(private paymentGateway: IPaymentGateway, private studentFeeDueRepository: IStudentFeeDueRepository, private paymentRepository: IPaymentRepository,) {}

  async execute(feeDueId: string, studentId: string, razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string): Promise<boolean> {
    try {
      
      const isVerified = await this.paymentGateway.verifyPayment(razorpayPaymentId, razorpayOrderId, razorpaySignature);
      if(!isVerified) {
        throw new Error('Payment verification failed');
      }
      const feeDues = await this.studentFeeDueRepository.findUnpaidByStudentId(studentId);
      const feeDue = feeDues.find((due) => due.getId() === feeDueId);
      if (!feeDue) throw new Error('Fee due not found');

      const payment = new Payment(
        new Date().getTime().toString(),
        studentId,
        feeDueId,
        feeDue.getAmount(),
        new Date(),
        'Razorpay',
        razorpayOrderId
      );
      await this.paymentRepository.create(payment);

      feeDue.markAsPaid(payment.getId());
      await this.studentFeeDueRepository.update(feeDue);

      return true;
    } catch (error) {
      throw new Error(`Payment verification failed: ${error.message}`);
    }
  }
}