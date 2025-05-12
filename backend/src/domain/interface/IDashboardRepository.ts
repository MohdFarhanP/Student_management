import { AdminDashboardStats, StudentDashboardStats, TeacherDashboardStats } from "../types/interfaces";

export interface IDashboardRepository {
  getAdminDashboardStats(): Promise<AdminDashboardStats>;
  getStudentDashboardStats(studentId: string): Promise<StudentDashboardStats>;
  getTeacherDashboardStats(teacherId: string): Promise<TeacherDashboardStats>;
}