import { ITeacherRepository } from "../../../../domain/interface/admin/ITeacherRepository";
import { ClassSubjectDto } from "../../../../domain/types/interfaces";
import { IFetchTeacherClassesUseCase } from "../../../../domain/interface/IFetchTeacherClassesUseCase";

export class FetchTeacherClassesUseCase implements IFetchTeacherClassesUseCase {
  constructor(private readonly teacherRepository: ITeacherRepository) {}

  async execute(teacherId: string): Promise<ClassSubjectDto[]> {
    if (!teacherId) throw new Error('Teacher ID is required');
    return this.teacherRepository.getTeacherClasses(teacherId);
  }
}