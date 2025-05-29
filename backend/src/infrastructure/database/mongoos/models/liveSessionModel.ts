import mongoose from 'mongoose';
import { ILiveSessionModel } from '../interface/ILiveSessionModel';
import { LiveSessionSchema } from '../scheema/liveSessionSchema';

export const LiveSessionModel = mongoose.model<ILiveSessionModel>(
  'LiveSession',
  LiveSessionSchema
);
