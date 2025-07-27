import { Types } from 'mongoose';
import { SubjectName } from '../types/enums';

export class SubjectEntity {
  constructor(
    public id: string,
    public subjectName: SubjectName,
    public teachers: Types.ObjectId[] | string[],
    public notes: string[] = []
  ) {}

  static create({
    id = new Types.ObjectId().toString(),
    subjectName = SubjectName.Mathematics,
    teachers = [],
    notes = [],
  }: Partial<SubjectEntity>): SubjectEntity {
    return new SubjectEntity(id, subjectName, teachers, notes);
  }
}
