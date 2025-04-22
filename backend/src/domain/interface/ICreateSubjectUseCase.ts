import { SubjectEntity } from '../../domain/entities/subject';

export interface ICreateSubjectUseCase {
  execute(grade: string, subjectData: Partial<SubjectEntity>): Promise<SubjectEntity>;
}