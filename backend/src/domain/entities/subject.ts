import { Types } from 'mongoose';
import { SubjectName } from '../types/enums';

export class SubjectEntity {
  constructor(
    public id: string,
    public subjectName: SubjectName,
    public teachers: Types.ObjectId[],
    public notes: string[] = []
  ) {}

  static create({
    id = new Types.ObjectId().toString(),
    subjectName = SubjectName.Math,
    teachers = [],
    notes = [],
  }: Partial<SubjectEntity>): SubjectEntity {
    return new SubjectEntity(id, subjectName, teachers as Types.ObjectId[], notes);
  }
}