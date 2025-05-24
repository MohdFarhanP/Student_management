import mongoose, { Schema, Document } from 'mongoose';

interface IStudentFeeDueModel extends Document {
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

const StudentFeeDueSchema = new Schema<IStudentFeeDueModel>(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    feeTitle: { type: String, required: true },
    month: { type: String, required: true },
    dueDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  },
  { timestamps: true }
);

export const StudentFeeDueModel = mongoose.model<IStudentFeeDueModel>('StudentFeeDue', StudentFeeDueSchema);