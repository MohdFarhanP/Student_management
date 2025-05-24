import { studentInfoDto } from "../types/interfaces";

export interface IGetStudentInfoUseCase {
    execute(userId: string): Promise<studentInfoDto | null>
}