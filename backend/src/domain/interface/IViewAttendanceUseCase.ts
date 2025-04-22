import { Attendance } from "../entities/attendance";

export interface IViewAttendanceUseCase {
  execute(studentId: string): Promise<Attendance[]>;
}