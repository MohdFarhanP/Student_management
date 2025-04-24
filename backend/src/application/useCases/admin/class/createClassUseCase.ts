import { IClassRepository } from '../../../../domain/interface/admin/IClassRepository';
import { ICreateClassUseCase } from '../../../../domain/interface/ICreateClassUseCase';
import { ClassEntity } from '../../../../domain/entities/class';
import { IClass } from '../../../../domain/types/interfaces';

export class CreateClassUseCase implements ICreateClassUseCase {
  constructor(private classRepository: IClassRepository) {}

  async execute(classData: Partial<IClass>): Promise<string> {
    try {
      const existingClass = await this.classRepository.findByNameAndSection(
        classData.name!,
        classData.section!
      );

      if (existingClass) {
        throw new Error('Class with the same name and section already exists');
      }

      const newClass = new ClassEntity(classData);

      await this.classRepository.create(newClass);

      return 'Class created successfully';
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to create class');
    }
  }
}