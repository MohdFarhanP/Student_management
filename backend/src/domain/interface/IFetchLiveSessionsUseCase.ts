import { SessionDto } from "../types/interfaces";

export interface IFetchLiveSessionsUseCase {
    execute(teacherId: string): Promise<SessionDto[]>
}