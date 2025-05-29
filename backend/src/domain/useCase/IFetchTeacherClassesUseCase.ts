import { ClassSubjectDto } from '../../application/dtos/classDtos';

export interface IFetchTeacherClassesUseCase {
  execute(teacherId: string): Promise<ClassSubjectDto[]>;
}
