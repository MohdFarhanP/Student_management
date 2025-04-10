import mongoose from 'mongoose';
import { IAttendanceRepository } from '../../../domain/interface/IAttendanceRepository.js';
import { Attendance } from '../../../domain/entities/attendance.js';

const attendanceSchema = new mongoose.Schema({
  classId: { type: mongoose.Types.ObjectId, required: true },
  studentId: { type: mongoose.Types.ObjectId, required: true },
  date: { type: Date, required: true },
  period: { type: Number, required: true, min: 1, max: 6 },
  status: { type: String, enum: ['present', 'absent'], required: true },
  createdBy: { type: mongoose.Types.ObjectId, required: true },
});

const AttendanceModel = mongoose.model('Attendance', attendanceSchema);

export class AttendanceRepository implements IAttendanceRepository {
  async save(attendance: Attendance): Promise<void> {
    const doc = new AttendanceModel({
      classId: attendance.classId,
      studentId: attendance.studentId,
      date: attendance.date,
      period: attendance.period,
      status: attendance.status,
      createdBy: attendance.createdBy,
    });
    await doc.save();
  }

  async findByClassDatePeriod(
    classId: string,
    date: Date,
    period: number
  ): Promise<Attendance | null> {
    const doc = await AttendanceModel.findOne({
      classId,
      date: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999)),
      },
      period,
    }).lean();
    return doc
      ? Attendance.create({
          id: doc._id.toString(),
          classId: doc.classId.toString(),
          studentId: doc.studentId.toString(),
          date: doc.date,
          period: doc.period,
          status: doc.status,
          createdBy: doc.createdBy.toString(),
        })
      : null;
  }
}
