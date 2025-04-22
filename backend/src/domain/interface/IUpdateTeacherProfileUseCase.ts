import { Teacher } from "../entities/teacher";

export interface IUpdateTeacherProfileUseCase {
  execute(profile: Partial<Teacher>): Promise<Teacher | null>;
}