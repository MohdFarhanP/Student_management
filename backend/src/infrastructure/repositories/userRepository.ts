import { Model, Document } from 'mongoose';
import { AdminModel } from '../database/models/adminModel.js';
import { studentModel } from '../database/models/studentModel.js';
import { TeacherModel } from '../database/models/teacherModel.js';
import { IUserRepository } from '../../domain/interface/IUserTokenRepository.js';

interface IUserDocument extends Document {
  id: string;
  email: string;
  role?: string;
  password?: string;
  refreshToken?: string | null;
  isInitialLogin?: boolean;
}

export class UserRepository implements IUserRepository {
  private getModel(role: string): Model<IUserDocument> {
    switch (role) {
      case 'Admin':
        return AdminModel as unknown as Model<IUserDocument>;
      case 'Student':
        return studentModel as unknown as Model<IUserDocument>;
      case 'Teacher':
        return TeacherModel as unknown as Model<IUserDocument>;
      default:
        throw new Error('Invalid role');
    }
  }
  async findByEmailAndRole(
    email: string,
    role: string
  ): Promise<{
    id: string;
    email: string;
    password: string;
    isInitialLogin: boolean;
  } | null> {
    const Model = this.getModel(role);
    const user = await Model.findOne({ email });
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      password: user.password ?? '',
      isInitialLogin: user.isInitialLogin ?? true,
    };
  }

  async findByRefreshToken(
    refreshToken: string,
    role: string
  ): Promise<{
    id: string;
    email: string;
    role: string;
    isInitialLogin: boolean;
  } | null> {
    const Model = this.getModel(role);
    const user = await Model.findOne({ refreshToken });
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      role,
      isInitialLogin: user.isInitialLogin ?? true,
    };
  }

  async updatePassword(id: string, password: string): Promise<void> {
    const roles = ['Admin', 'Student', 'Teacher'];
    for (const role of roles) {
      const Model = this.getModel(role);
      const user = await Model.findByIdAndUpdate(id, {
        password,
        isInitialLogin: false,
      });
      if (user) break;
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
      if (user) break;
    }
  }
}
