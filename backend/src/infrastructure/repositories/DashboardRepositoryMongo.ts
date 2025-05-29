import { IDashboardRepository } from '../../domain/repositories/IDashboardRepository';
import { AdminDashboardStats } from '../../domain/types/interfaces';
import { studentModel } from '../database/mongoos/models/studentModel';
import { ClassModel } from '../database/mongoos/models/classModel';
import { TeacherModel } from '../database/mongoos/models/teacherModel';

export class DashboardRepositoryMongo implements IDashboardRepository {
  async getAdminDashboardStats(): Promise<AdminDashboardStats> {
    const [totalStudents, totalTeachers, totalClasses] = await Promise.all([
      studentModel.countDocuments().exec(),
      TeacherModel.countDocuments().exec(),
      ClassModel.countDocuments().exec(),
    ]);
    return {
      totalStudents,
      totalTeachers,
      totalClasses,
    };
  }
}
