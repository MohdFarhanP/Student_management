import { SubjectEntity } from '../entities/subject';

export interface IUpdateSubjectUseCase {
  execute(
    classGrade: string,
    subjectId: string,
    updatedData: Partial<SubjectEntity>
  ): Promise<SubjectEntity>;
}
