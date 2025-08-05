export class Payment {
  private id: string;
  private studentId: string;
  private feeDueId: string;
  private amount: number;
  private paymentDate: Date;
  private paymentMethod: string;
  private transactionId: string;

  constructor(
    id: string,
    studentId: string,
    feeDueId: string,
    amount: number,
    paymentDate: Date,
    paymentMethod: string,
    transactionId: string
  ) {
    this.id = id;
    this.studentId = studentId;
    this.feeDueId = feeDueId;
    this.amount = this.validateAmount(amount);
    this.paymentDate = this.validatePaymentDate(paymentDate);
    this.paymentMethod = paymentMethod;
    this.transactionId = transactionId;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  setId(id: string) {
    this.id = id;
  }

  getStudentId(): string {
    return this.studentId;
  }

  getFeeDueId(): string {
    return this.feeDueId;
  }

  getAmount(): number {
    return this.amount;
  }

  getPaymentDate(): Date {
    return this.paymentDate;
  }

  getPaymentMethod(): string {
    return this.paymentMethod;
  }

  getTransactionId(): string {
    return this.transactionId;
  }

  // Business rules
  private validateAmount(amount: number): number {
    if (amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }
    return amount;
  }

  private validatePaymentDate(paymentDate: Date): Date {
    if (isNaN(paymentDate.getTime())) {
      throw new Error('Invalid payment date');
    }
    return paymentDate;
  }
}
