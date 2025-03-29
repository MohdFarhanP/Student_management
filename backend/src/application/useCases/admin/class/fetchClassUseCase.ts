import { ClassRepository } from '../../../infrastructure/repositories/classRepository.js';

export class FetchClassUseCase {
  constructor(private classRepository: ClassRepository) {}

  async execute() {
    return await this.classRepository.fetchClass();
  }
}
