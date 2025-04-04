import { ClassRepository } from '../../../../infrastructure/repositories/admin/classRepository.js';

export class FetchClassUseCase {
  constructor(private classRepository: ClassRepository) {}

  async execute() {
    return await this.classRepository.fetchClass();
  }
}
