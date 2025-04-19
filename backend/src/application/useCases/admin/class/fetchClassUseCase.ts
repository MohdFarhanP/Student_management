import { ClassRepository } from '../../../../infrastructure/repositories/admin/classRepository';

export class FetchClassUseCase {
  constructor(private classRepository: ClassRepository) {}

  async execute() {
    return await this.classRepository.fetchClass();
  }
}
