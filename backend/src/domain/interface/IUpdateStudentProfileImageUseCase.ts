
export interface IUpdateStudentProfileImageUseCase {
  execute(studentId: string, fileUrl: string, fileHash: string): Promise<string>;
}