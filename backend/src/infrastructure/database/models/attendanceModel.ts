import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    studentId: {
      type: mongoose.Types.ObjectId,
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
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const AttendanceModel = mongoose.model('Attendance', attendanceSchema);
