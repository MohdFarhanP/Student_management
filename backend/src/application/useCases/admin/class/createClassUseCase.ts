import { IClassRepository } from '../../../../domain/repositories/IClassRepository';
import { ICreateClassUseCase } from '../../../../domain/useCase/ICreateClassUseCase';
import { ClassEntity } from '../../../../domain/entities/class';
import { IClass } from '../../../../domain/types/interfaces';

export class CreateClassUseCase implements ICreateClassUseCase {
  constructor(private classRepository: IClassRepository) {}

  async execute(classData: Partial<IClass>): Promise<string> {
    try {
      // Validate required fields
      const requiredFields = [
        'name',
        'section',
        'teachers',
        'students',
        'totalStudents',
        'tutor',
        'roomNo',
        'subjects',
        'grade',
        'chatRoomId',
      ];

      for (const field of requiredFields) {
        if (classData[field as keyof IClass] === undefined) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Check for duplicate class
      const existingClass = await this.classRepository.findByNameAndSection(
        classData.name!,
        classData.section!
      );

      if (existingClass) {
        throw new Error('Class with the same name and section already exists');
      }

      const newClass = new ClassEntity({
        id: classData.id,
        name: classData.name!,
        section: classData.section!,
        teachers: classData.teachers!.map((id) => id.toString()),
        timetable: classData.timetable?.toString() || null,
        students: classData.students!.map((id) => id.toString()),
        totalStudents: classData.totalStudents!,
        tutor: classData.tutor!.toString(),
        roomNo: classData.roomNo!,
        subjects: classData.subjects!.map((id) => id.toString()),
        grade: classData.grade!,
        chatRoomId: classData.chatRoomId!,
        isDeleted: classData.isDeleted ?? false,
      });

      await this.classRepository.create(newClass);

      return 'Class created successfully';
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Failed to create class');
    }
  }
}
