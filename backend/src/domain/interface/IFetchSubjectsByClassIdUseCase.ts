import { SubjectEntity } from '../../domain/entities/subject';

export interface IFetchSubjectsByClassIdUseCase {
  execute(classId: string): Promise<SubjectEntity[]>;
}