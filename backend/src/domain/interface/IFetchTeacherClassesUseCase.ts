import { ClassSubjectDto } from "../types/interfaces";

export interface IFetchTeacherClassesUseCase {
    execute(teacherId: string): Promise<ClassSubjectDto[]>
}