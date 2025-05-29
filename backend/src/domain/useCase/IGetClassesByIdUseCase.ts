import { IClassData } from '../../application/dtos/classDtos';

export interface IGetClassesByIdUseCase {
  execute(userId: string): Promise<IClassData>;
}
