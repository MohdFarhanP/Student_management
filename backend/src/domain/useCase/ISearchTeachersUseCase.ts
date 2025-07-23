import { TeacherDTO } from "../../application/dtos/teacherDtos";

export interface ISearchTeachersUseCase {
    execute(query: string): Promise<TeacherDTO[]>;
}