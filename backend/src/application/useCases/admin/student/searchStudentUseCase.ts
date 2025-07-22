import { IStudentRepository } from "../../../../domain/repositories/IStudentRepository";
import { ISearchStudentsUseCase } from "../../../../domain/useCase/ISearchStudentsUseCase";
import { StudentDTO } from "../../../dtos/studentDtos";

export class SearchStudentsUseCase implements ISearchStudentsUseCase {
    constructor(private studentRepository: IStudentRepository) {}
    async execute(quary:string): Promise<StudentDTO[]> {
        try {
            const students = await this.studentRepository.search(quary);
            if (!students || students.length === 0) {
                return [];
            }
            return students.map(student => StudentDTO.fromEntity(student));
        } catch (error) {
            throw error instanceof Error
                ? error
                : new Error('Failed to search students');
        }
    }
}