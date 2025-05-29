import mongoose, { Model } from 'mongoose';
import { ITimetableModel } from '../interface/ITimetableModel';
import { timetableSchema } from '../scheema/timetableSchema';

const TimetableModel: Model<ITimetableModel> = mongoose.model(
  'Timetable',
  timetableSchema
);

export default TimetableModel;
