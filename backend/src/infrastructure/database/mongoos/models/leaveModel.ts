import mongoose, { Model } from 'mongoose';
import { ILeaveModel } from '../interface/ILeaveModel';
import { leaveSchema } from '../scheema/leaveSchema';

export const LeaveModel: Model<ILeaveModel> = mongoose.model<ILeaveModel>(
  'Leave',
  leaveSchema
);
