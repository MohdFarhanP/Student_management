import { ClassRepository } from '../../../infrastructure/repositories/classRepository.js';
import { ClassEntity } from '../../../domain/entities/class.js';
import { Types } from 'mongoose';

export class CreateClassUseCase {
  constructor(private classRepository: ClassRepository) {}

  async execute(classData: Omit<ClassEntity, 'id'>) {
    const existingClass = await this.classRepository.findByNameAndSection(
      classData.name,
      classData.section
    );

    if (existingClass) {
      throw Error('Class with the same name and section already exists');
    }

    const newClass = ClassEntity.create({
      name: classData.name,
      section: classData.section,
      roomNo: classData.roomNo,
      grade: classData.grade,
      teachers: classData.teachers?.map((id) => new Types.ObjectId(id)) ?? [],
      students: classData.students?.map((id) => new Types.ObjectId(id)) ?? [],
      subjects: classData.subjects?.map((id) => new Types.ObjectId(id)) ?? [],
      totalStudents: classData.totalStudents ?? 0,
      timetable: classData.timetable
        ? new Types.ObjectId(classData.timetable)
        : null,
      tutor: classData.tutor.toString(),
    });

    return await this.classRepository.create({
      name: newClass.name,
      section: newClass.section,
      teachers: newClass.teachers,
      timetable: newClass.timetable ?? new Types.ObjectId(),
      students: newClass.students,
      totalStudents: newClass.totalStudents,
      tutor: newClass.tutor,
      roomNo: newClass.roomNo,
      subjects: newClass.subjects,
      grade: newClass.grade,
    });
  }
}
