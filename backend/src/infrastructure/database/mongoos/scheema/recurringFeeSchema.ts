import mongoose, { Schema } from 'mongoose';
import { IRecurringFeeModel } from '../interface/IRecurringFeeModel';

export const RecurringFeeSchema = new Schema<IRecurringFeeModel>(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    startMonth: { type: String, required: true },
    endMonth: { type: String },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    recurring: { type: Boolean, default: true },
  },
  { timestamps: true }
);
