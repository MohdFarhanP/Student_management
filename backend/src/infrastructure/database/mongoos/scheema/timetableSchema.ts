import { Schema } from 'mongoose';
import { ITimetableModel, ITimetableSlot } from '../interface/ITimetableModel';

const timetableSlotSchema = new Schema<ITimetableSlot>({
  period: { type: Number, required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher', default: null },
  subject: { type: String, default: null },
});

export const timetableSchema = new Schema<ITimetableModel>({
  classId: {
    type: Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  schedule: {
    Monday: { type: [timetableSlotSchema], required: true },
    Tuesday: { type: [timetableSlotSchema], required: true },
    Wednesday: { type: [timetableSlotSchema], required: true },
    Thursday: { type: [timetableSlotSchema], required: true },
    Friday: { type: [timetableSlotSchema], required: true },
  },
});
