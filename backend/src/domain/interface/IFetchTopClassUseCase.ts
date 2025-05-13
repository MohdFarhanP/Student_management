import { TopClassDto } from "../types/interfaces";

export interface IFetchTopClassUseCase {
    execute(limit?: number ): Promise<TopClassDto[]>
}
