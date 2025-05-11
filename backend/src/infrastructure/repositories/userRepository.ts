import { Model, Document } from 'mongoose';
import { AdminModel } from '../database/models/adminModel';
import { studentModel } from '../database/models/studentModel';
import { TeacherModel } from '../database/models/teacherModel';
import { IUserRepository } from '../../domain/interface/IUserRepository';
import { Role } from '../../domain/types/enums';
import { IUser } from '../../domain/types/interfaces';

interface IUserDocument extends Document {
  id: string;
  email: string;
  role?: string;
  password?: string;
  refreshToken?: string | null;
  isInitialLogin?: boolean;
}

export class UserRepository implements IUserRepository {
  private getModel(role: Role): Model<IUserDocument> {
    switch (role) {
      case Role.Admin:
        return AdminModel as unknown as Model<IUserDocument>;
      case Role.Student:
        return studentModel as unknown as Model<IUserDocument>;
      case Role.Teacher:
        return TeacherModel as unknown as Model<IUserDocument>;
      default:
        throw new Error('Invalid role');
    }
  }

  async findByEmailAndRole(email: string, role: Role): Promise<IUser | null> {
    const Model = this.getModel(role);
    const user = await Model.findOne({ email });
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      role,
      password: user.password ?? '',
      isInitialLogin: user.isInitialLogin ?? true,
      refreshToken: user.refreshToken ?? null,
    };
  }

  async findByRefreshToken(token: string, role: Role): Promise<IUser | null> {
    try {
      const Model = this.getModel(role);
      const user = await Model.findOne({ refreshToken: token });
      if (!user) return null;
      return {
        id: user.id,
        email: user.email,
        role,
        isInitialLogin: user.isInitialLogin ?? true,
        refreshToken: user.refreshToken ?? null,
      };
    } catch (error) {
      console.log('error on user repo: ', error);
      return null;
    }
  }

  async updatePassword(id: string, password: string): Promise<void> {
    const roles = [Role.Admin, Role.Student, Role.Teacher];
    for (const role of roles) {
      const Model = this.getModel(role);
      const user = await Model.findByIdAndUpdate(id, {
        password,
        isInitialLogin: false,
      });
      if (user) break;
    }
  }

  async updateRefreshToken(id: string, refreshToken: string | null): Promise<void> {
    try {
      const roles = [Role.Admin, Role.Student, Role.Teacher];
      for (const role of roles) {
        const Model = this.getModel(role);
        const user = await Model.findByIdAndUpdate(id, { refreshToken }, { new: true });
        if (user) break;
      }
    } catch (error) {
      console.log('error on update refresh token', error);
    }
  }

  async findById(id: string): Promise<IUser | null> {
    const roles = [Role.Admin, Role.Student, Role.Teacher];
    for (const role of roles) {
      const Model = this.getModel(role);
      const user = await Model.findById(id).exec();
      if (user) {
        return {
          id: user.id,
          email: user.email,
          role,
          password: user.password ?? '',
          isInitialLogin: user.isInitialLogin ?? true,
          refreshToken: user.refreshToken ?? null,
        };
      }
    }
    return null;
  }

  async findTeachers(): Promise<IUser[]> {
    const teachers = await TeacherModel.find().exec();
    return teachers.map((user) => ({
      id: user.id,
      email: user.email,
      role: Role.Teacher,
      password: user.password ?? '',
      isInitialLogin: user.isInitialLogin ?? true,
      refreshToken: user.refreshToken ?? null,
    }));
  }
}