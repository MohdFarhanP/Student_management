import mongoose from 'mongoose';
import { IRecurringFeeModel } from '../interface/IRecurringFeeModel';
import { RecurringFeeSchema } from '../scheema/recurringFeeSchema';

export const RecurringFeeModel = mongoose.model<IRecurringFeeModel>(
  'RecurringFee',
  RecurringFeeSchema
);
