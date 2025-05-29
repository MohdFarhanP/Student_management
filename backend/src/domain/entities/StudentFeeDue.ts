export class StudentFeeDue {
  private id: string;
  private studentId: string;
  private feeTitle: string;
  private month: string;
  private dueDate: Date;
  private amount: number;
  private isPaid: boolean;
  private paymentId?: string;

  constructor(
    id: string,
    studentId: string,
    feeTitle: string,
    month: string,
    dueDate: Date,
    amount: number,
    isPaid: boolean = false,
    paymentId?: string
  ) {
    this.id = id;
    this.studentId = studentId;
    this.feeTitle = feeTitle;
    this.month = this.validateMonthFormat(month);
    this.dueDate = this.validateDueDate(dueDate);
    this.amount = this.validateAmount(amount);
    this.isPaid = isPaid;
    this.paymentId = paymentId;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getStudentId(): string {
    return this.studentId;
  }

  getFeeTitle(): string {
    return this.feeTitle;
  }

  getMonth(): string {
    return this.month;
  }

  getDueDate(): Date {
    return this.dueDate;
  }

  getAmount(): number {
    return this.amount;
  }

  isPaidStatus(): boolean {
    return this.isPaid;
  }

  getPaymentId(): string | undefined {
    return this.paymentId;
  }

  // Business rules
  private validateMonthFormat(month: string): string {
    const regex = /^\d{4}-\d{2}$/;
    if (!regex.test(month)) {
      throw new Error('Month must be in YYYY-MM format');
    }
    return month;
  }

  private validateDueDate(dueDate: Date): Date {
    if (isNaN(dueDate.getTime())) {
      throw new Error('Invalid due date');
    }
    return dueDate;
  }

  private validateAmount(amount: number): number {
    if (amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }
    return amount;
  }

  // Mark as paid
  markAsPaid(paymentId: string): void {
    if (this.isPaid) {
      throw new Error('Fee is already paid');
    }
    this.isPaid = true;
    this.paymentId = paymentId;
  }
}
