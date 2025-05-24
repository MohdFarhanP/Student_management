import mongoose, { Schema, Document } from 'mongoose';

interface IRecurringFeeModel extends Document {
  title: string;
  amount: number;
  startMonth: string;
  endMonth?: string;
  classId: mongoose.Types.ObjectId | { _id: mongoose.Types.ObjectId; name: string };
  recurring: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RecurringFeeSchema = new Schema<IRecurringFeeModel>(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    startMonth: { type: String, required: true },
    endMonth: { type: String },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    recurring: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const RecurringFeeModel = mongoose.model<IRecurringFeeModel>('RecurringFee', RecurringFeeSchema);