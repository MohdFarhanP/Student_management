import { IDashboardRepository } from '../../domain/interface/IDashboardRepository';
import { AdminDashboardStats } from '../../domain/types/interfaces';
import { studentModel } from '../database/models/studentModel';
import { ClassModel } from '../database/models/classModel';
import { TeacherModel } from '../database/models/teacherModel';

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

  // async getStudentDashboardStats(studentId: string): Promise<StudentDashboardStats> {
  //   const [attendanceRecords, leaves, sessions] = await Promise.all([
  //     this.attendanceRepository.findByStudentId(studentId),
  //     this.leaveRepository.findByStudentId(studentId),
  //     this.liveSessionRepository.findById(studentId), // Adjust to find upcoming sessions
  //   ]);
  //   const totalAttendance = attendanceRecords.length;
  //   const presentCount = attendanceRecords.filter((a) => a.status === 'present').length;
  //   const attendancePercentage = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0;
  //   const pendingLeaves = leaves.filter((l) => l.status === 'Pending').length;
  //   const upcomingSessions = sessions ? 1 : 0; // Adjust logic based on LiveSession schema
  //   return { attendancePercentage, pendingLeaves, upcomingSessions };
  // }

  // async getTeacherDashboardStats(teacherId: string): Promise<TeacherDashboardStats> {
  //   const teacher = await this.teacherRepository.getById(teacherId);
  //   if (!teacher || !teacher.assignedClass) {
  //     return { todayClasses: 0, pendingLeaves: 0, upcomingSessions: 0 };
  //   }
  //   const classId = teacher.assignedClass;
  //   const [timetable, leaves, sessions] = await Promise.all([
  //     this.timetableRepository.getByClassId(Object(classId)),
  //     this.leaveRepository.findByStudentId(''), // Adjust to teacher-specific pending leaves
  //     this.liveSessionRepository.findById(teacherId), // Adjust to find upcoming sessions
  //   ]);
  //   const today = new Date().toLocaleString('en-US', { weekday: 'long' }) as Day;
  //   const todayClasses = timetable.schedule[today]?.length || 0;
  //   const pendingLeaves = leaves.filter((l) => l.status === 'Pending').length;
  //   const upcomingSessions = sessions ? 1 : 0; // Adjust logic
  //   return { todayClasses, pendingLeaves, upcomingSessions };
  // }
}