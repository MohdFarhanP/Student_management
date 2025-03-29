import { AdminModel } from '../database/models/adminModel.js';
import { studentModel } from '../database/models/studentModel.js';
import { TeacherModel } from '../database/models/teacherModel.js';
import { IUserRepository } from '../../domain/interface/IUserRepository.js';

export class UserRepository implements IUserRepository {
  async findByEmailAndRole(
    email: string,
    role: string
  ): Promise<{ id: string; email: string; password: string } | null> {
    let user;
    if (role === 'Admin') {
      user = await AdminModel.findOne({ email });
    } else if (role === 'Student') {
      user = await studentModel.findOne({ email });
    } else if (role === 'Teacher') {
      user = await TeacherModel.findOne({ email });
    }
    if (!user) return null;
    return { id: user.id, email: user.email, password: user.password ?? '' };
  }

  async updatePassword(id: string, password: string): Promise<void> {
    await Promise.all([
      AdminModel.findByIdAndUpdate(id, { password }),
      studentModel.findByIdAndUpdate(id, { password }),
      TeacherModel.findByIdAndUpdate(id, { password }),
    ]);
  }
}
