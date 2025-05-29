import { IClassData } from '../../application/dtos/classDtos';

export interface IGetClassesUseCase {
  execute(
    page: number,
    limit: number
  ): Promise<{ data: IClassData[]; totalCount: number }>;
}
