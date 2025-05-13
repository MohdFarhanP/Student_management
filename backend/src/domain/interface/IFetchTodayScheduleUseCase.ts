import { ScheduleDto } from "../types/interfaces";

export interface IFetchTodayScheduleUseCase {
    execute(teacherId: string): Promise<ScheduleDto[]>
}