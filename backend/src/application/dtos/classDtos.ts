export interface IClassData {
  id: string;
  name: string;
  grade: string;
  section: string;
  roomNo: string;
  tutor: string;
  totalStudents?: number;
  chatRoomId?: string;
}

export interface TopClassDto {
  className: string;
  attendancePercentage: number;
}

export interface ClassSubjectDto {
  className: string;
  subject: string;
  classId: string;
}
