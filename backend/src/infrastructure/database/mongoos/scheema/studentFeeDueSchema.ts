import mongoose, { Schema } from 'mongoose';
import { IStudentFeeDueModel } from '../interface/IStudentFeeDueModel';

export const StudentFeeDueSchema = new Schema<IStudentFeeDueModel>(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    feeTitle: { type: String, required: true },
    month: { type: String, required: true },
    dueDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  },
  { timestamps: true }
);
