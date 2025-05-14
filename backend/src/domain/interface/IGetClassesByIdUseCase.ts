import { IClassData } from "../types/interfaces";

export interface IGetClassesByIdUseCase {
    execute(userId:string): Promise<IClassData>
}