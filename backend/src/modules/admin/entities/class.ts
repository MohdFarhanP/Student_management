export class ClassEntity {
    constructor(
      public id: string,
      public name: string,
      public section: string,
      public teachers: string[],
      public timetable: string,
      public students: string[],
      public totalStudents: number,
      public tutor: string,
      public roomNo: string,
      public subjects: string[],
      public grade: string
    ) {}
  
    static create(
      id: string,
      name: string,
      section: string,
      teachers: string[],
      timetable: string,
      students: string[],
      totalStudents: number,
      tutor: string,
      roomNo: string,
      subjects: string[],
      grade: string
    ) {
      return new ClassEntity(id, name, section, teachers, timetable, students, totalStudents, tutor, roomNo, subjects, grade);
    }
  }
  