export interface INotificationService {
  notifyTeachers(message: string): Promise<void>;
  notifyStudent(studentId: string, message: string): Promise<void>;
}