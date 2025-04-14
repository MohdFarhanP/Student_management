import { Types } from 'mongoose';

export class Attendance {
  constructor(
    public id: string,
    public classId: Types.ObjectId | string,
    public studentId: Types.ObjectId | string,
    public date: Date,
    public period: number,
    public status: 'present' | 'absent',
    public day: string,
    public createdBy: Types.ObjectId | string
  ) {}

  static create(data: Partial<Attendance>): Attendance {
    return new Attendance(
      data.id || '',
      Types.ObjectId.isValid(data.classId as string)
        ? new Types.ObjectId(data.classId as string)
        : data.classId || new Types.ObjectId(),
      Types.ObjectId.isValid(data.studentId as string)
        ? new Types.ObjectId(data.studentId as string)
        : data.studentId || new Types.ObjectId(),
      data.date || new Date(),
      data.period || 1,
      data.status || 'present',
      data.day || '',
      Types.ObjectId.isValid(data.createdBy as string)
        ? new Types.ObjectId(data.createdBy as string)
        : data.createdBy || new Types.ObjectId()
    );
  }
}
