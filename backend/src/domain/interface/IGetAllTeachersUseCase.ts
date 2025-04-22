import { Teacher } from '../entities/teacher';

export interface IGetAllTeachersUseCase {
  execute(): Promise<Teacher[]>;
}