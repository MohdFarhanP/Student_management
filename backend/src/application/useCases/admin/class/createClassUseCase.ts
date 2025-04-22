import { IClassRepository } from '../../../../domain/interface/admin/IClassRepository';
import { ClassEntity } from '../../../../domain/entities/class';
import { Types } from 'mongoose';
import { ICreateClassUseCase } from '../../../../domain/interface/ICreateClassUseCase';

export class CreateClassUseCase implements ICreateClassUseCase {
  constructor(private classRepository: IClassRepository) {}

  async execute(classData: Omit<ClassEntity, 'id'>): Promise<string> {
    try {
      const existingClass = await this.classRepository.findByNameAndSection(
        classData.name,
        classData.section
      );

      if (existingClass) {
        throw new Error('Class with the same name and section already exists');
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
        tutor: classData.tutor,
      });

      await this.classRepository.create({
        name: newClass.name,
        section: newClass.section,
        teachers: newClass.teachers,
        timetable: newClass.timetable ?? null,
        students: newClass.students,
        totalStudents: newClass.totalStudents,
        tutor: newClass.tutor,
        roomNo: newClass.roomNo,
        subjects: newClass.subjects,
        grade: newClass.grade,
      });

      return 'Class created successfully';
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to create class');
    }
  }
}