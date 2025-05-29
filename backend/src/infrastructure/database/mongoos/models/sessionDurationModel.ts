import mongoose from 'mongoose';
import { SessionDurationShema } from '../scheema/sessionDurationShema';

export const SessionDurationModel = mongoose.model(
  'SessionDuration',
  SessionDurationShema
);
