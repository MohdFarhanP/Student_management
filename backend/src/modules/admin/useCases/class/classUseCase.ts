import { ClassRepository } from "../../repositories/classRepository";
import { ClassEntity } from "../../entities/class";

export class CreateClassUseCase {
  constructor(private classRepository: ClassRepository) {}

  async execute(classData: Omit<ClassEntity, "id">) {
    return await this.classRepository.create(
      new ClassEntity(
        "", 
        classData.name,
        classData.section,
        classData.teachers,
        classData.timetable,
        classData.students,
        classData.totalStudents,
        classData.tutor,
        classData.roomNo,
        classData.subjects,
        classData.grade
      )
    );
  }
}
