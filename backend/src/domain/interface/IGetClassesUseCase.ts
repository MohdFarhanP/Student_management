import { IClassData } from "../types/interfaces";

export interface IGetClassesUseCase {
  execute(page: number, limit: number): Promise<{ data: IClassData[]; totalCount: number }>;
}