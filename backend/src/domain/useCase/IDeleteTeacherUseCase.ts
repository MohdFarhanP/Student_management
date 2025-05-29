export interface IDeleteTeacherUseCase {
  execute(teacherId: string): Promise<void>;
}
