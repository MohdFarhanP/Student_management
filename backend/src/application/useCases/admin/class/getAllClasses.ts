import { ClassRepository } from '../../../../infrastructure/repositories/admin/classRepository.js';

export class GetClassesUseCase {
  constructor(private classRepository: ClassRepository) {}

  async execute(page: number, limit: number) {
    return await this.classRepository.findAll(page, limit);
  }
}
