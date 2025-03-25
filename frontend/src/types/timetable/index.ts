export interface TimetableSlot {
  period: number;
  teacherId: string | null;
  teacherName?: string;
  subject: string | null;
}

export interface TimetableSchedule {
  [day: string]: TimetableSlot[];
}

export interface TimetableData {
  classId: string;
  className?: string;
  schedule: TimetableSchedule;
}

export interface TeacherData {
  id: string;
  name: string;
  subjects: string[];
  availability: { [day: string]: number[] };
}
