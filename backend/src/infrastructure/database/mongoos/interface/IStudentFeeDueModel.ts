import mongoose, { Document } from 'mongoose';

export interface IStudentFeeDueModel extends Document {
  studentId: mongoose.Types.ObjectId;
  feeTitle: string;
  month: string;
  dueDate: Date;
  amount: number;
  isPaid: boolean;
  paymentId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
