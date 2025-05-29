import { Grade, Section } from '../types/enums';

export class ClassEntity {
  public readonly id?: string;
  public readonly name: string;
  public readonly section: Section;
  public readonly teachers: string[];
  public readonly timetable: string | null;
  public readonly students: string[];
  public readonly totalStudents: number;
  public readonly tutor: string;
  public readonly roomNo: string;
  public readonly subjects: string[];
  public readonly grade: Grade;
  public readonly chatRoomId: string;
  public readonly isDeleted?: boolean;

  constructor(params: {
    id?: string;
    name: string;
    section: Section;
    teachers: string[];
    timetable: string | null;
    students: string[];
    totalStudents: number;
    tutor: string;
    roomNo: string;
    subjects: string[];
    grade: Grade;
    chatRoomId: string;
    isDeleted?: boolean;
  }) {
    const {
      id,
      name,
      section,
      teachers,
      timetable,
      students,
      totalStudents,
      tutor,
      roomNo,
      subjects,
      grade,
      chatRoomId,
      isDeleted,
    } = params;

    if (!name || !tutor || !roomNo || !grade || !section) {
      throw new Error('Missing required class fields');
    }

    this.id = id;
    this.name = name;
    this.section = section;
    this.teachers = teachers;
    this.timetable = timetable;
    this.students = students;
    this.totalStudents = totalStudents;
    this.tutor = tutor;
    this.roomNo = roomNo;
    this.subjects = subjects;
    this.grade = grade;
    this.chatRoomId = chatRoomId;
    this.isDeleted = isDeleted ?? false;
  }
}
