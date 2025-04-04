import { IStudentRepository } from '../../../../domain/interface/admin/IStudentRepository.js';

export class GetAllStudentsUseCase {
  constructor(private studentRepository: IStudentRepository) {}

  async execute(page: number, limit: number) {
    return await this.studentRepository.getAll(page, limit);
  }
}
