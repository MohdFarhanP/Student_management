import mongoose, { Document } from 'mongoose';

export interface IPaymentModel extends Document {
  studentId: mongoose.Types.ObjectId;
  feeDueId: mongoose.Types.ObjectId;
  amount: number;
  paymentDate: Date;
  paymentMethod: string;
  transactionId: string;
  createdAt: Date;
  updatedAt: Date;
}
