export interface IMarkAttendanceUseCase {
    execute(
      classId: string,
      studentId: string,
      date: Date,
      period: number,
      status: 'present' | 'absent',
      teacherId: string,
      day: string
    ): Promise<void>;
  }