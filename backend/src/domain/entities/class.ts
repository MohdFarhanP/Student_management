import { Types } from 'mongoose';

export class ClassEntity {
  constructor(
    public id: string,
    public name: string,
    public section: string,
    public teachers: Types.ObjectId[],
    public timetable: Types.ObjectId | null,
    public students: Types.ObjectId[],
    public totalStudents: number,
    public tutor: string,
    public roomNo: string,
    public subjects: Types.ObjectId[],
    public grade: string
  ) {}

  static create({
    id = new Types.ObjectId().toString(),
    name = '',
    section = '',
    teachers = [],
    timetable = null,
    students = [],
    totalStudents = 0,
    tutor = '',
    roomNo = '',
    subjects = [],
    grade = '',
  }: Partial<ClassEntity>): ClassEntity {
    return new ClassEntity(
      id,
      name,
      section,
      teachers as Types.ObjectId[],
      timetable as Types.ObjectId | null,
      students as Types.ObjectId[],
      totalStudents,
      tutor.toString(),
      roomNo,
      subjects as Types.ObjectId[],
      grade
    );
  }
}
