import mongoose from 'mongoose';
import { IAttendanceRepository } from '../../../domain/interface/IAttendanceRepository.js';
import { Attendance } from '../../../domain/entities/attendance.js';
import { IAttendance } from '../../../domain/interface/IAttendance.js';
import { AttendanceModel } from '../../database/models/attendanceModel.js';
import { Types } from 'mongoose';

type LeanAttendance = Omit<IAttendance, 'id'> & {
  _id: mongoose.Types.ObjectId;
};

export class AttendanceRepository implements IAttendanceRepository {
  async save(attendance: Attendance): Promise<void> {
    const { classId, studentId, date, period, status, day, createdBy } =
      attendance;
    const result = await AttendanceModel.findOneAndUpdate(
      {
        classId: new Types.ObjectId(classId as string),
        studentId: new Types.ObjectId(studentId as string),
        date: new Date(date),
        period,
        day,
      },
      {
        $setOnInsert: {
          status,
          createdBy: new Types.ObjectId(createdBy as string),
        },
      },
      { upsert: true, new: true, runValidators: true }
    );
    if (!result) {
      throw new Error('Failed to save attendance');
    }
  }

  async findByStudentClassDatePeriod(
    classId: string,
    studentId: string,
    date: Date,
    period: number,
    day: string
  ): Promise<Attendance | null> {
    const doc = await AttendanceModel.findOne({
      classId: new Types.ObjectId(classId),
      studentId: new Types.ObjectId(studentId),
      date: new Date(date.setHours(0, 0, 0, 0)),
      period,
      day,
    }).lean<LeanAttendance>();
    return doc
      ? Attendance.create({
          id: doc._id.toString(),
          classId: doc.classId.toString(),
          studentId: doc.studentId.toString(),
          date: doc.date,
          period: doc.period,
          status: doc.status,
          day: doc.day,
          createdBy: doc.createdBy.toString(),
        })
      : null;
  }

  async findByStudentId(studentId: string): Promise<Attendance[]> {
    const docs = await AttendanceModel.find({
      studentId: new Types.ObjectId(studentId),
    })
      .lean<LeanAttendance[]>()
      .exec();
    return docs.map((doc) =>
      Attendance.create({
        id: doc._id.toString(),
        classId: doc.classId.toString(),
        studentId: doc.studentId.toString(),
        date: doc.date,
        period: doc.period,
        status: doc.status,
        day: doc.day,
        createdBy: doc.createdBy.toString(),
      })
    );
  }
}
