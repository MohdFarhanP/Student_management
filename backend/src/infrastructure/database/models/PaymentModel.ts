// src/infrastructure/models/payment-model.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IPaymentModel extends Document {
  studentId: mongoose.Types.ObjectId;
  feeDueId: mongoose.Types.ObjectId;
  amount: number;
  paymentDate: Date;
  paymentMethod: string;
  transactionId: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPaymentModel>(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    feeDueId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentFeeDue', required: true },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, required: true },
    paymentMethod: { type: String, required: true },
    transactionId: { type: String, required: true },
  },
  { timestamps: true }
);

export const PaymentModel = mongoose.model<IPaymentModel>('Payment', PaymentSchema);