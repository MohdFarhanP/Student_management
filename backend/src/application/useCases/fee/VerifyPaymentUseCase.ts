import { Payment } from "../../../domain/entities/Payment";
import { ConflictError } from "../../../domain/errors";
import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
import { IStudentFeeDueRepository } from "../../../domain/repositories/IStudentFeeDueRepository";
import { IPaymentGateway } from "../../services/IPaymentGateway";

export class VerifyPaymentUseCase implements IVerifyPaymentUseCase {
  constructor(private paymentGateway: IPaymentGateway, private studentFeeDueRepository: IStudentFeeDueRepository, private paymentRepository: IPaymentRepository,) {}

  async execute(feeDueId: string, studentId: string, razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string): Promise<boolean> {
    try {
      const isVerified = await this.paymentGateway.verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);
      if(!isVerified) {
        throw new Error('Payment verification failed');
      }
      const feeDues = await this.studentFeeDueRepository.findUnpaidByStudentId(studentId);
      const feeDue = feeDues.find((due) => due.getId() === feeDueId);
      if (!feeDue) throw new Error('Fee due not found');

      const result = await this.paymentRepository.isPaidDue(feeDueId);
      if(result){
        feeDue.markAsPaid(result.getId());
        await this.studentFeeDueRepository.update(feeDue);
        throw new ConflictError('Fee due is already paid');
      }
      const payment = new Payment(
        undefined,
        studentId,
        feeDueId,
        feeDue.getAmount(),
        new Date(),
        'Razorpay',
        razorpayOrderId
      );
      const res = await this.paymentRepository.create(payment);
      feeDue.markAsPaid(res.getId());
      await this.studentFeeDueRepository.update(feeDue);

      return true;
    } catch (error) {
      if(error instanceof ConflictError) throw error;
      throw new Error(`Payment verification failed: ${error.message}`);
    }
  }
}