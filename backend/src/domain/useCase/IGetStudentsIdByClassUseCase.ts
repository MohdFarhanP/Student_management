import { StudentIdsDTO } from '../../application/dtos/studentDtos';

export interface IGetStudentsIdByClassUseCase {
  execute(classId: string): Promise<StudentIdsDTO>;
}
