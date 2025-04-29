
export interface IUpdateStudentProfileImageUseCase {
  execute(studentId: string, file: File): Promise<string>;
}