import { IClassRepository } from '../../../../domain/repositories/IClassRepository';
import { IGetClassesUseCase } from '../../../../domain/useCase/IGetClassesUseCase';
import { IClassData } from '../../../dtos/classDtos';

export class GetClassesUseCase implements IGetClassesUseCase {
  constructor(private classRepository: IClassRepository) {}

  async execute(
    page: number,
    limit: number
  ): Promise<{ data: IClassData[]; totalCount: number }> {
    try {
      const { data: classes, totalCount } = await this.classRepository.findAll(
        page,
        limit
      );

      const classData: IClassData[] = classes.map((classEntity) => ({
        id: classEntity.id || '',
        name: classEntity.name,
        grade: classEntity.grade.toString(),
        section: classEntity.section.toString(),
        roomNo: classEntity.roomNo,
        tutor: classEntity.tutor,
        totalStudents: classEntity.totalStudents,
      }));

      return { data: classData, totalCount };
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Failed to fetch classes');
    }
  }
}
