import { TeacherModel } from '../../database/models/teacherModel.js';
import { Teacher } from '../../../domain/entities/teacher.js';
import { ITeacherProfileRepository } from '../../../domain/interface/teacher/ITeacherProfileRepository.js';
import mongoose from 'mongoose';

interface PopulatedTeacher {
  _id: string | mongoose.Types.ObjectId;
  name: string;
  email: string;
  empId: string;
  dob: string;
  phoneNo: number;
  gender: 'Male' | 'Female';
  assignedClass?: { name: string } | null;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class TeacherProfileRepository implements ITeacherProfileRepository {
  async getProfile(email: string): Promise<Teacher | null> {
    const rawTeacher = await TeacherModel.findOne({ email })
      .select('-password')
      .populate('assignedClass', 'name')
      .lean();

    if (!rawTeacher) return null;

    const teacherData = rawTeacher as unknown as PopulatedTeacher;
    return new Teacher({
      id: teacherData._id.toString(),
      name: teacherData.name,
      email: teacherData.email,
      empId: teacherData.empId,
      dateOfBirth: teacherData.dob,
      gender: teacherData.gender,
      assignedClass: teacherData.assignedClass
        ? teacherData.assignedClass.name
        : null,
      profileImage: teacherData.profileImage,
      phoneNo: teacherData.phoneNo,
    });
  }
}
