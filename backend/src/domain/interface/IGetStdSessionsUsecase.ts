import { ILiveSessionDto } from "../types/interfaces";

export interface IGetStdSessionsUsecase {
    execute(userId: string): Promise<ILiveSessionDto[]| null>
}