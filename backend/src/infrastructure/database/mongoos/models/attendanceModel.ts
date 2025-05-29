import mongoose from 'mongoose';
import { attendanceSchema } from '../scheema/attendanceSchema';
import { IAttendanceModel } from '../interface/IAttendanceModel';

export const AttendanceModel = mongoose.model<IAttendanceModel>(
  'Attendance',
  attendanceSchema
);
