export class Attendance {
  constructor(
    public id: string,
    public classId: string,
    public studentId: string,
    public date: Date,
    public period: number,
    public status: 'present' | 'absent',
    public createdBy: string
  ) {}

  static create(data: Partial<Attendance>): Attendance {
    return new Attendance(
      data.id || '',
      data.classId || '',
      data.studentId || '',
      data.date || new Date(),
      data.period || 1,
      data.status || 'present',
      data.createdBy || ''
    );
  }
}
