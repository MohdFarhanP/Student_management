import mongoose, { Schema } from 'mongoose';
import { IAttendance } from '../../../domain/interface/IAttendance';

const attendanceSchema = new Schema<IAttendance>(
  {
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    period: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
    },
    status: {
      type: String,
      enum: ['present', 'absent'],
      required: true,
      default: 'present',
    },
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

attendanceSchema.index(
  { classId: 1, studentId: 1, date: 1, period: 1, day: 1 },
  { unique: true }
);

export const AttendanceModel = mongoose.model<IAttendance>(
  'Attendance',
  attendanceSchema
);
