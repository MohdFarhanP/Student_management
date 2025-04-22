import { Teacher } from "../entities/teacher";

export interface IGetTeacherProfileUseCase {
  execute(email: string): Promise<Teacher>;
}