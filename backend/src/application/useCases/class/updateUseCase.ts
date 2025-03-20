import { ClassEntity } from '../../../domain/entities/class.js';
import { ClassRepository } from '../../../infrastructure/repositories/classRepository.js';

export class UpdateClassUseCase {
  constructor(private classRepository: ClassRepository) {}

  async execute(classId: string, updatedData: Partial<ClassEntity>) {
    const existingClass = await this.classRepository.findById(classId);
    if (!existingClass) {
      throw new Error('Class not found');
    }

    const filteredUpdates = Object.fromEntries(
      Object.entries(updatedData).filter(
        ([key, value]) =>
          value !== undefined &&
          value !== existingClass[key as keyof ClassEntity]
      )
    );

    if (Object.keys(filteredUpdates).length === 0) {
      throw new Error('No changes detected');
    }

    return await this.classRepository.update(classId, filteredUpdates);
  }
}
