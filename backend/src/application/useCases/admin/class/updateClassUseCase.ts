import { ClassEntity } from '../../../../domain/entities/class';
import { IClassRepository } from '../../../../domain/interface/admin/IClassRepository';
import { IUpdateClassUseCase } from '../../../../domain/interface/IUpdateClassUseCase';
import { IClass } from '../../../../domain/types/interfaces';

export class UpdateClassUseCase implements IUpdateClassUseCase {
  constructor(private classRepository: IClassRepository) {}

  async execute(classId: string, updatedData: Partial<IClass>): Promise<string> {
    try {
      const existingClass = await this.classRepository.findById(classId);
      if (!existingClass) {
        throw new Error('Class not found');
      }

      if (updatedData.grade || updatedData.section || updatedData.name) {
        const updatedGrade = updatedData.grade || existingClass.grade;
        const updatedSection = updatedData.section || existingClass.section;
        const updatedName = updatedData.name || existingClass.name;
        updatedData.chatRoomId = `class-${updatedGrade}-${updatedSection}-${updatedName}`;
      }

      const filteredUpdates: Partial<IClass> = Object.fromEntries(
        Object.entries(updatedData).filter(
          ([key, value]) =>
            value !== undefined &&
            value !== existingClass[key as keyof ClassEntity]
        )
      );

      if (Object.keys(filteredUpdates).length === 0) {
        throw new Error('No changes detected');
      }

      await this.classRepository.update(classId, filteredUpdates);
      return 'Class updated successfully';
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to update class');
    }
  }
}