import { AttendanceDataDto } from "../types/interfaces";

export interface IFetchWeeklyAttendanceUseCase {
    execute(classId: string): Promise<AttendanceDataDto[]>
}