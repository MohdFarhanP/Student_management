import { TeacherNameDTO } from '../../application/dtos/teacherDtos';

export interface IGetAllTeachersUseCase {
  execute(): Promise<TeacherNameDTO[]>;
}
