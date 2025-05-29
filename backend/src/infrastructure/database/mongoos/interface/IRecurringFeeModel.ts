import mongoose, { Document } from 'mongoose';

export interface IRecurringFeeModel extends Document {
  title: string;
  amount: number;
  startMonth: string;
  endMonth?: string;
  classId:
    | mongoose.Types.ObjectId
    | { _id: mongoose.Types.ObjectId; name: string };
  recurring: boolean;
  createdAt: Date;
  updatedAt: Date;
}
