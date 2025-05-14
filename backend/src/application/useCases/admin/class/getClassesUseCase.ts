import { IClassRepository } from '../../../../domain/interface/admin/IClassRepository';
import { IGetClassesUseCase } from '../../../../domain/interface/IGetClassesUseCase';
import { IClassData } from '../../../../domain/types/interfaces';

export class GetClassesUseCase implements IGetClassesUseCase {
  constructor(private classRepository: IClassRepository) {}

  async execute(page: number, limit: number): Promise<{ data: IClassData[]; totalCount: number }> {
    try {
      const { data: classes, totalCount } = await this.classRepository.findAll(page, limit);

      // Transform ClassEntity to IClassData
      const classData: IClassData[] = classes.map((classEntity) => ({
        id: classEntity.id || '',
        name: classEntity.name,
        grade: classEntity.grade.toString(), 
        section: classEntity.section.toString(),
        roomNo: classEntity.roomNo,
        tutor: classEntity.tutor && typeof classEntity.tutor === 'object' && 'name' in classEntity.tutor
          ? (classEntity.tutor as { name: string }).name
          : null,
        totalStudents: classEntity.totalStudents,
      }));

      return { data: classData, totalCount };
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch classes');
    }
  }
}