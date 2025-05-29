import { SubjectEntity } from '../entities/subject';

export interface ICreateSubjectUseCase {
  execute(
    grade: string,
    subjectData: Partial<SubjectEntity>
  ): Promise<SubjectEntity>;
}
