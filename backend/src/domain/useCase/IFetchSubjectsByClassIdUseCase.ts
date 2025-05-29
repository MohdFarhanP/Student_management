import { SubjectEntity } from '../entities/subject';

export interface IFetchSubjectsByClassIdUseCase {
  execute(classId: string): Promise<SubjectEntity[]>;
}
