import { SubjectEntity } from '../entities/subject';

export interface IGetSubjectsByGradeUseCase {
  execute(grade: string): Promise<SubjectEntity[]>;
}
