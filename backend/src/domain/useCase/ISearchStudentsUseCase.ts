import { StudentDTO } from '../../application/dtos/studentDtos';

export interface ISearchStudentsUseCase {
  execute(query: string): Promise<StudentDTO[]>;
}
