import { teacherModel } from '../database/models/teacherModel.js';
import { IRepository } from '../../domain/interface/IRepository.js';
import { Teacher } from '../../domain/entities/teacher.js';

export class TeacherRepository implements IRepository<Teacher> {
  async insertMany(teachers: Teacher[]) {
    if (!teachers || teachers.length === 0) {
      return;
    }

    await teacherModel.insertMany(teachers);
  }
  async getAll(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const teachersData = await teacherModel
      .find()
      .skip(skip)
      .limit(limit)
      .select('-password')
      .lean();
    const teachers = teachersData.map(
      (t) =>
        new Teacher({
          id: t._id.toString(),
          name: t.name,
          email: t.email,
          gender: t.gender,
          phoneNo: t.phoneNo,
          empId: t.empId,
          assignedClass: t.assignedClass?.toString() || null,
          subject: t.subject?.toString() || null,
          dateOfBirth: t.dateOfBirth,
          profileImage: t.profileImage || '',
          specialization: t.specialization || '',
          experienceYears: t.experienceYears || 0,
          qualification: t.qualification || '',
        })
    );

    const totalCount = await teacherModel.countDocuments();
    return { data: teachers, totalCount };
  }
}
