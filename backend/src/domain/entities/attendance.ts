import { Types } from 'mongoose';

export class Attendance {
  constructor(
    public id: string,
    public classId: string,
    public studentId: string,
    public date: Date,
    public period: number,
    public status: 'present' | 'absent',
    public day: string,
    public createdBy: string
  ) {}

  static create(data: Partial<Attendance>): Attendance {
    if (!data.classId || !Types.ObjectId.isValid(data.classId)) {
      throw new Error('Valid class ID is required');
    }
    if (!data.studentId || !Types.ObjectId.isValid(data.studentId)) {
      throw new Error('Valid student ID is required');
    }
    if (!data.createdBy || !Types.ObjectId.isValid(data.createdBy)) {
      throw new Error('Valid createdBy ID is required');
    }
    return new Attendance(
      data.id || new Types.ObjectId().toString(),
      data.classId,
      data.studentId,
      data.date || new Date(),
      data.period || 1,
      data.status || 'present',
      data.day || 'Monday',
      data.createdBy
    );
  }
}