import { ObjectId } from '../../types/index';
import { TimetableSchedule } from '../../types/index';

class Timetable {
  classId: ObjectId;
  schedule: TimetableSchedule;

  constructor(classId: ObjectId, schedule?: TimetableSchedule) {
    this.classId = classId;
    this.schedule = schedule || {
      Monday: Array(6)
        .fill(null)
        .map((_, i) => ({ period: i + 1, teacherId: null, subject: null })),
      Tuesday: Array(6)
        .fill(null)
        .map((_, i) => ({ period: i + 1, teacherId: null, subject: null })),
      Wednesday: Array(6)
        .fill(null)
        .map((_, i) => ({ period: i + 1, teacherId: null, subject: null })),
      Thursday: Array(6)
        .fill(null)
        .map((_, i) => ({ period: i + 1, teacherId: null, subject: null })),
      Friday: Array(6)
        .fill(null)
        .map((_, i) => ({ period: i + 1, teacherId: null, subject: null })),
    };
  }

  assignTeacher(
    day: string,
    period: number,
    teacherId: ObjectId | null,
    subject: string | null
  ): void {
    if (!this.schedule[day] || period < 1 || period > 6) {
      throw new Error('Invalid slot');
    }
    this.schedule[day][period - 1] = { period, teacherId, subject };
  }
}

export default Timetable;
