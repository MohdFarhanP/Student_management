import { ClassRepository } from '../../../../infrastructure/repositories/admin/classRepository';

export class GetClassNameUseCase {
  constructor(private classRepository: ClassRepository) {}

  async execute() {
    return await this.classRepository.findAllGrades();
  }
}
