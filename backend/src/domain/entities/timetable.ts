import { ObjectId } from '../../types';
import { TimetableSchedule, TimetableSlot } from '../types/interfaces';
import { Day } from '../types/enums';

export class Timetable {
  private _classId: ObjectId;
  private _schedule: TimetableSchedule;

  constructor(classId: ObjectId, schedule?: TimetableSchedule) {
    this._classId = classId;
    this._schedule = this.normalizeSchedule(schedule);
  }

  get classId(): ObjectId {
    return this._classId;
  }

  get schedule(): TimetableSchedule {
    return { ...this._schedule }; // Return a shallow copy to prevent external mutation
  }

  private normalizeSchedule(schedule?: TimetableSchedule): TimetableSchedule {
    const defaultSlots: TimetableSlot[] = Array(6)
      .fill(null)
      .map((_, i) => ({ period: i + 1, teacherId: null, subject: null }));

    const normalized: TimetableSchedule = {
      [Day.Monday]: defaultSlots,
      [Day.Tuesday]: defaultSlots,
      [Day.Wednesday]: defaultSlots,
      [Day.Thursday]: defaultSlots,
      [Day.Friday]: defaultSlots,
    };

    if (schedule) {
      for (const day of Object.values(Day)) {
        if (schedule[day] && Array.isArray(schedule[day])) {
          // Ensure exactly 6 slots, preserving valid slots
          const existingSlots = schedule[day].filter(
            (slot) => slot.period >= 1 && slot.period <= 6
          );
          const slotsMap = new Map(existingSlots.map((slot) => [slot.period, slot]));
          normalized[day] = Array(6)
            .fill(null)
            .map((_, i) => slotsMap.get(i + 1) || { period: i + 1, teacherId: null, subject: null });
        }
      }
    }

    return normalized;
  }

  assignTeacher(
    day: Day,
    period: number,
    teacherId: ObjectId | null,
    subject: string | null
  ): void {
    if (!Object.values(Day).includes(day)) {
      throw new Error(`Invalid day: ${day}. Must be one of: ${Object.values(Day).join(', ')}`);
    }
    if (!Number.isInteger(period) || period < 1 || period > 6) {
      throw new Error(`Invalid period: ${period}. Must be an integer between 1 and 6`);
    }

    this._schedule[day][period - 1] = { period, teacherId, subject };
  }

  clearSlot(day: Day, period: number): void {
    if (!Object.values(Day).includes(day)) {
      throw new Error(`Invalid day: ${day}. Must be one of: ${Object.values(Day).join(', ')}`);
    }
    if (!Number.isInteger(period) || period < 1 || period > 6) {
      throw new Error(`Invalid period: ${period}. Must be an integer between 1 and 6`);
    }

    this._schedule[day][period - 1] = { period, teacherId: null, subject: null };
  }
}