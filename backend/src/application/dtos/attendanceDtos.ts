export interface AttendanceDataDto {
  day: string;
  attendance: number;
}

export interface StudentAttendance {
  studentId: string;
  studentName: string;
  durationSeconds: number;
  joinTime: Date;
  leaveTime: Date;
}
