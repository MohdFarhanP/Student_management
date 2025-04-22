import mongoose, { Model, Schema } from 'mongoose';
import { TimetableSlot, TimetableSchedule, TimetableData } from '../../../domain/types/interfaces';
import { Day } from '../../../domain/types/enums';

const timetableSlotSchema = new Schema<TimetableSlot>({
  period: { type: Number, required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher', default: null },
  subject: { type: String, default: null },
});

const timetableSchema = new Schema<TimetableData>({
  classId: {
    type: Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  schedule: {
    [Day.Monday]: [timetableSlotSchema],
    [Day.Tuesday]: [timetableSlotSchema],
    [Day.Wednesday]: [timetableSlotSchema],
    [Day.Thursday]: [timetableSlotSchema],
    [Day.Friday]: [timetableSlotSchema],
  },
});

const TimetableModel: Model<TimetableData> = mongoose.model('Timetable', timetableSchema);

export default TimetableModel;