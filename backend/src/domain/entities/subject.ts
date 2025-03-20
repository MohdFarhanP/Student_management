import { Types } from 'mongoose';

export class SubjectEntity {
  constructor(
    public id: string = new Types.ObjectId().toString(), // Ensure it has an id
    public subjectName: string,
    public teachers: string[],
    public notes: string[] = []
  ) {}

  static create({
    id = new Types.ObjectId().toString(),
    subjectName = '',
    teachers = [],
    notes = [],
  }: Partial<SubjectEntity>): SubjectEntity {
    return new SubjectEntity(id, subjectName, teachers, notes);
  }
}
