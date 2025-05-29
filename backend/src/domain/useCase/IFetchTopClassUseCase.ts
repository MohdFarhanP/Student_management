import { TopClassDto } from '../../application/dtos/classDtos';

export interface IFetchTopClassUseCase {
  execute(limit?: number): Promise<TopClassDto[]>;
}
