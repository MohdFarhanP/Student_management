import { Student } from "../entities/student";

export interface IUpdateStudentProfileImageUseCase {
  execute(email: string, profileImage: string): Promise<Student>;
}