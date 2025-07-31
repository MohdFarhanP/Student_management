interface IVerifyPaymentUseCase {
    execute(feeDueId: string, studentId: string, razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string): Promise<boolean>;
}
