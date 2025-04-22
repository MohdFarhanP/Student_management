import { SubjectEntity } from '../../domain/entities/subject';
import { Types } from 'mongoose';

export interface ISubjectRepository {
  create(subjectData: SubjectEntity): Promise<SubjectEntity>;
  findByName(subjectName: string): Promise<SubjectEntity | null>;
  findByIds(subjectIds: Types.ObjectId[]): Promise<SubjectEntity[]>;
  update(id: string, subjectData: Partial<SubjectEntity>): Promise<SubjectEntity | null>;
  delete(id: string): Promise<boolean>;
}