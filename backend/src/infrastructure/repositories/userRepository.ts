// infrastructure/repositories/UserRepository.ts
import { AdminModel } from '../database/models/adminModel.js';
import { studentModel } from '../database/models/studentModel.js';
import { TeacherModel } from '../database/models/teacherModel.js';
import { IUserRepository } from '../../domain/interfaces/IUserRepository.js';

export class UserRepository implements IUserRepository {
  private getModel(role: string) {
    switch (role) {
      case 'Admin':
        return AdminModel;
      case 'Student':
        return studentModel;
      case 'Teacher':
        return TeacherModel;
      default:
        throw new Error('Invalid role');
    }
  }

  async findByEmailAndRole(
    email: string,
    role: string
  ): Promise<{ id: string; email: string; password: string } | null> {
    const Model = this.getModel(role);
    const user = await Model.findOne({ email });
    if (!user) return null;
    return { id: user.id, email: user.email, password: user.password ?? '' };
  }

  async findByRefreshToken(
    refreshToken: string,
    role: string
  ): Promise<{ id: string; email: string; role: string } | null> {
    const Model = this.getModel(role);
    const user = await Model.findOne({ refreshToken });
    if (!user) return null;
    return { id: user.id, email: user.email, role };
  }

  async updatePassword(id: string, password: string): Promise<void> {
    const roles = ['Admin', 'Student', 'Teacher'];
    for (const role of roles) {
      const Model = this.getModel(role);
      const user = await Model.findByIdAndUpdate(id, { password });
      if (user) break; // Stop once the user is found and updated
    }
  }

  async updateRefreshToken(
    id: string,
    refreshToken: string | null
  ): Promise<void> {
    const roles = ['Admin', 'Student', 'Teacher'];
    for (const role of roles) {
      const Model = this.getModel(role);
      const user = await Model.findByIdAndUpdate(id, { refreshToken });
      if (user) break; // Stop once the user is found and updated
    }
  }
}
