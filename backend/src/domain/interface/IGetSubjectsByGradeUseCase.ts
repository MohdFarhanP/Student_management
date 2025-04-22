import { SubjectEntity } from '../../domain/entities/subject';

export interface IGetSubjectsByGradeUseCase {
  execute(grade: string): Promise<SubjectEntity[]>;
}