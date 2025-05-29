export class RecurringFee {
  private id: string;
  private title: string;
  private amount: number;
  private startMonth: string;
  private endMonth?: string;
  private classId: string;
  private className?: string;
  private recurring: boolean;

  constructor(
    id: string,
    title: string,
    amount: number,
    startMonth: string,
    classId: string,
    recurring: boolean,
    endMonth?: string,
    className?: string
  ) {
    this.id = id;
    this.title = title;
    this.amount = this.validateAmount(amount);
    this.startMonth = this.validateMonthFormat(startMonth);
    this.classId = classId;
    this.recurring = recurring;
    this.endMonth = endMonth ? this.validateMonthFormat(endMonth) : undefined;
    this.className = className ? className : 'Unknown';
    this.validateMonths();
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  getAmount(): number {
    return this.amount;
  }

  getStartMonth(): string {
    return this.startMonth;
  }

  getEndMonth(): string | undefined {
    return this.endMonth;
  }

  getClassId(): string {
    return this.classId;
  }

  getClassName(): string {
    return this.className;
  }

  isRecurring(): boolean {
    return this.recurring;
  }

  // Business rules
  private validateAmount(amount: number): number {
    if (amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }
    return amount;
  }

  private validateMonthFormat(month: string): string {
    const regex = /^\d{4}-\d{2}$/;
    if (!regex.test(month)) {
      throw new Error('Month must be in YYYY-MM format');
    }
    return month;
  }

  private validateMonths(): void {
    if (this.endMonth && this.startMonth > this.endMonth) {
      throw new Error('Start month cannot be after end month');
    }
  }

  // Check if the fee is active for a given month
  isActiveForMonth(month: string): boolean {
    return (
      this.startMonth <= month &&
      (this.endMonth === undefined || this.endMonth >= month)
    );
  }
}
