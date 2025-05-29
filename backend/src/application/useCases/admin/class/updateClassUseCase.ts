import { ClassEntity } from '../../../../domain/entities/class';
import { IClassRepository } from '../../../../domain/repositories/IClassRepository';
import { IUpdateClassUseCase } from '../../../../domain/useCase/IUpdateClassUseCase';
import { IClass } from '../../../../domain/types/interfaces';
import { Types } from 'mongoose';

// Utility function to convert ObjectId to string
const toStringId = (value: any): string => {
  if (value instanceof Types.ObjectId) {
    return value.toString();
  }
  return value?.toString() ?? '';
};

export class UpdateClassUseCase implements IUpdateClassUseCase {
  constructor(private classRepository: IClassRepository) {}

  async execute(
    classId: string,
    updatedData: Partial<IClass>
  ): Promise<string> {
    try {
      const existingClass = await this.classRepository.findById(classId);
      if (!existingClass) {
        throw new Error('Class not found');
      }

      // Generate chatRoomId if grade, section, or name is updated
      if (updatedData.grade || updatedData.section || updatedData.name) {
        const updatedGrade = updatedData.grade || existingClass.grade;
        const updatedSection = updatedData.section || existingClass.section;
        const updatedName = updatedData.name || existingClass.name;
        updatedData.chatRoomId = `class-${updatedGrade}-${updatedSection}-${updatedName}`;
      }

      // Filter out undefined values and unchanged fields
      const filteredUpdates: Partial<IClass> = Object.fromEntries(
        Object.entries(updatedData).filter(
          ([key, value]) =>
            value !== undefined &&
            value !== existingClass[key as keyof ClassEntity]
        )
      );

      // Validate required fields
      if (
        filteredUpdates.name === '' ||
        filteredUpdates.tutor === '' ||
        filteredUpdates.roomNo === '' ||
        filteredUpdates.grade === undefined ||
        filteredUpdates.section === undefined
      ) {
        throw new Error('Required fields cannot be empty or undefined');
      }

      // Transform potential ObjectId to strings
      const transformedUpdates: Partial<IClass> = {
        ...filteredUpdates,
        teachers: filteredUpdates.teachers?.map(toStringId),
        students: filteredUpdates.students?.map(toStringId),
        subjects: filteredUpdates.subjects?.map(toStringId),
        tutor: filteredUpdates.tutor
          ? toStringId(filteredUpdates.tutor)
          : undefined,
        timetable: filteredUpdates.timetable
          ? toStringId(filteredUpdates.timetable)
          : filteredUpdates.timetable,
      };

      if (Object.keys(filteredUpdates).length === 0) {
        throw new Error('No changes detected');
      }

      await this.classRepository.update(classId, transformedUpdates);
      return 'Class updated successfully';
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Failed to update class');
    }
  }
}
