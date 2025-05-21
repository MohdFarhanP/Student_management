import { SessionAttendanceDTO } from "../types/interfaces";

export interface IGetRecentSessionAttendanceUseCase {
    execute(teacherId: string, limit?: number): Promise<SessionAttendanceDTO[]>
}