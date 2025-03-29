import { ClassRepository } from '../../../infrastructure/repositories/classRepository.js';

export class GetClassNameUseCase {
  constructor(private classRepository: ClassRepository) {}

  async execute() {
    return await this.classRepository.findAllGrades();
  }
}
