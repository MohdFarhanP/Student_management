import mongoose from 'mongoose';
import { IPaymentModel } from '../interface/IPaymentModel';
import { PaymentSchema } from '../scheema/paymentSchema';

export const PaymentModel = mongoose.model<IPaymentModel>(
  'Payment',
  PaymentSchema
);
