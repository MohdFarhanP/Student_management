export interface IDeleteStudentUseCase {
    execute(studentId: string): Promise<void>;
  }