import mongoose, { Schema } from 'mongoose';
import { IPaymentModel } from '../interface/IPaymentModel';

export const PaymentSchema = new Schema<IPaymentModel>(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    feeDueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentFeeDue',
      required: true,
    },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, required: true },
    paymentMethod: { type: String, required: true },
    transactionId: { type: String, required: true },
  },
  { timestamps: true }
);
