import { Types } from 'mongoose';
import { IAttendanceRepository } from '../../../domain/interface/IAttendanceRepository';
import { Attendance } from '../../../domain/entities/attendance';
import { AttendanceModel } from '../../database/models/attendanceModel';
import { AttendanceDataDto } from '../../../domain/types/interfaces';

export class AttendanceRepository implements IAttendanceRepository {

  async save(attendance: Attendance): Promise<void> {
    const { classId, studentId, date, period, status, day, createdBy } = attendance;
    const result = await AttendanceModel.findOneAndUpdate(
      {
        classId: new Types.ObjectId(classId as string),
        studentId: new Types.ObjectId(studentId as string),
        date: new Date(date.setHours(0, 0, 0, 0)),
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
    }).lean();
    if (!doc) return null;
    return Attendance.create({
      id: doc._id.toString(),
      classId: doc.classId.toString(),
      studentId: doc.studentId.toString(),
      date: doc.date,
      period: doc.period,
      status: doc.status,
      day: doc.day,
      createdBy: doc.createdBy.toString(),
    });
  }

  async findByStudentId(studentId: string): Promise<Attendance[]> {
    const docs = await AttendanceModel.find({
      studentId: new Types.ObjectId(studentId),
    }).lean();
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

  async getWeeklyAttendance(classId: string): Promise<AttendanceDataDto[]> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const attendance = await AttendanceModel.aggregate([
      {
        $match: {
          classId: new Types.ObjectId(classId),
          date: { $gte: oneWeekAgo },
          day: { $in: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
        },
      },
      {
        $group: {
          _id: '$day',
          present: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } },
          total: { $sum: 1 },
        },
      },
      {
        $match: { total: { $gt: 0 } }, // Prevent division by zero
      },
      {
        $project: {
          day: '$_id',
          attendance: { $multiply: [{ $divide: ['$present', '$total'] }, 100] },
        },
      },
      {
        $sort: {
          day: 1, // Sort by day (Monday to Friday)
        },
      },
    ]);

    // Map to ensure all days are included, even if no data
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const result: AttendanceDataDto[] = days.map((day) => {
      const record = attendance.find((item) => item.day === day);
      return {
        day,
        attendance: record ? Math.round(record.attendance) : 0,
      };
    });

    return result;
  }
}