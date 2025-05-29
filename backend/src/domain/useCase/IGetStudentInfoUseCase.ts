import { studentInfoDto } from '../../application/dtos/studentDtos';

export interface IGetStudentInfoUseCase {
  execute(userId: string): Promise<studentInfoDto | null>;
}
