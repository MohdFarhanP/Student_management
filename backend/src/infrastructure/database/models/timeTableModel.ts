import mongoose, { Model } from 'mongoose';
import { TimetableData } from '../../../types/index';

const timetableSchema = new mongoose.Schema<TimetableData>({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  schedule: { type: Object, required: true },
});

const TimetableModel: Model<TimetableData> = mongoose.model(
  'Timetable',
  timetableSchema
);

export default TimetableModel;
