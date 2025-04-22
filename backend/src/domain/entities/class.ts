import { Types } from 'mongoose';
import { Grade, Section } from '../types/enums';

export class ClassEntity {
  constructor(
    public id: string,
    public name: string,
    public section: Section,
    public teachers: Types.ObjectId[],
    public timetable: Types.ObjectId | null,
    public students: Types.ObjectId[],
    public totalStudents: number,
    public tutor: Types.ObjectId, // Changed to ObjectId
    public roomNo: string,
    public subjects: Types.ObjectId[],
    public grade: Grade
  ) {}

  static create({
    id = new Types.ObjectId().toString(),
    name = '',
    section = Section.A,
    teachers = [],
    timetable = null,
    students = [],
    totalStudents = 0,
    tutor = new Types.ObjectId(), // Default to new ObjectId
    roomNo = '',
    subjects = [],
    grade = Grade.Grade1,
  }: Partial<ClassEntity>): ClassEntity {
    return new ClassEntity(
      id,
      name,
      section,
      teachers as Types.ObjectId[],
      timetable as Types.ObjectId | null,
      students as Types.ObjectId[],
      totalStudents,
      tutor as Types.ObjectId,
      roomNo,
      subjects as Types.ObjectId[],
      grade
    );
  }
}