import { ClassRepository } from '../../../../infrastructure/repositories/admin/classRepository.js';

export class GetClassNameUseCase {
  constructor(private classRepository: ClassRepository) {}

  async execute() {
    return await this.classRepository.findAllGrades();
  }
}
