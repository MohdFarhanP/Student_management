import mongoose from 'mongoose';
import { Grade, Section } from '../types/enums';
import { IClass } from '../types/interfaces';

export class ClassEntity implements IClass {
  id?: string;
  name: string;
  section: Section;
  teachers: mongoose.Types.ObjectId[];
  timetable: mongoose.Types.ObjectId | null;
  students: mongoose.Types.ObjectId[];
  totalStudents: number;
  tutor: mongoose.Types.ObjectId;
  roomNo: string;
  subjects: mongoose.Types.ObjectId[];
  grade: Grade;
  isDeleted?: boolean;

  constructor(data: Partial<IClass>) {
    this.id = data.id || data._id?.toString();
    this.name = data.name || '';
    this.section = Object.values(Section).includes(data.section as Section)
      ? (data.section as Section)
      : Section.A;
    this.teachers = data.teachers || [];
    this.timetable = data.timetable ?? null;
    this.students = data.students || [];
    this.totalStudents = data.totalStudents || 0;
    this.tutor = data.tutor || new mongoose.Types.ObjectId(); 
    this.roomNo = data.roomNo || '';
    this.subjects = data.subjects || [];
    this.grade = Object.values(Grade).includes(data.grade as Grade)
      ? (data.grade as Grade)
      : Grade.Grade1;
    this.isDeleted = data.isDeleted ?? false;
  }
}