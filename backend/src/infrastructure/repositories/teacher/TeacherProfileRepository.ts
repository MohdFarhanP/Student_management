import { TeacherModel } from '../../database/models/teacherModel';
import { Teacher } from '../../../domain/entities/teacher';
import { ITeacherProfileRepository } from '../../../domain/interface/teacher/ITeacherProfileRepository';
import mongoose from 'mongoose';
import { ClassModel } from '../../database/models/classModel';
import { SubjectModel } from '../../database/models/subjectModel';

interface PopulatedTeacher extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  empId: string;
  dateOfBirth: string;
  phoneNo: number;
  gender: 'Male' | 'Female';
  assignedClass?: { name: string } | null;
  subject?: { name: string } | null;
  profileImage?: string;
  specialization?: string;
  experienceYears?: number;
  qualification?: string;
}
interface PopulatedClass {
  _id: string | mongoose.Types.ObjectId;
  name: string;
}

interface PopulatedSubject {
  _id: string | mongoose.Types.ObjectId;
  subjectName: string;
}

function isPopulatedClass(value: unknown): value is PopulatedClass {
  return typeof value === 'object' && value !== null && 'name' in value;
}

function isPopulatedSubject(value: unknown): value is PopulatedSubject {
  return typeof value === 'object' && value !== null && 'subjectName' in value;
}

export class TeacherProfileRepository implements ITeacherProfileRepository {
  async getProfile(email: string): Promise<Teacher | null> {
    const rawTeacher = await TeacherModel.findOne({ email })
      .select('-password')
      .populate('assignedClass', 'name')
      .populate('subject', 'name')
      .lean();

    if (!rawTeacher) return null;

    const teacherData = rawTeacher as unknown as PopulatedTeacher;
    return new Teacher({
      id: teacherData._id.toString(),
      name: teacherData.name,
      email: teacherData.email,
      empId: teacherData.empId,
      dateOfBirth: teacherData.dateOfBirth,
      gender: teacherData.gender,
      assignedClass: teacherData.assignedClass
        ? teacherData.assignedClass.name
        : null,
      subject: teacherData.subject ? teacherData.subject.name : null,
      profileImage: teacherData.profileImage,
      phoneNo: teacherData.phoneNo,
      specialization: teacherData.specialization,
      experienceYears: teacherData.experienceYears,
      qualification: teacherData.qualification,
    });
  }

  async updateProfile(profile: Partial<Teacher>): Promise<Teacher | null> {
    if (profile.subject && typeof profile.subject === 'string') {
      const subjectDoc = await SubjectModel.findOne({
        subjectName: profile.subject,
      });
      if (!subjectDoc) {
        throw new Error(`Subject '${profile.subject}' not found`);
      }
      profile.subject = subjectDoc._id;
    }

    if (profile.assignedClass && typeof profile.assignedClass === 'string') {
      const classDoc = await ClassModel.findOne({
        name: profile.assignedClass,
      });
      if (!classDoc) {
        throw new Error(`Class '${profile.assignedClass}' not found`);
      }
      profile.assignedClass = classDoc._id;
    }

    const updatedTeacher = await TeacherModel.findOneAndUpdate(
      { email: profile.email },
      profile,
      { new: true, runValidators: true }
    )
      .select('-password')
      .populate('subject', 'subjectName')
      .populate('assignedClass', 'name')
      .exec();

    if (!updatedTeacher) {
      throw new Error('Teacher not found');
    }

    return new Teacher({
      ...updatedTeacher.toObject(),
      subject: isPopulatedSubject(updatedTeacher.subject)
        ? updatedTeacher.subject.subjectName
        : (updatedTeacher.subject ?? null),

      assignedClass: isPopulatedClass(updatedTeacher.assignedClass)
        ? updatedTeacher.assignedClass.name
        : (updatedTeacher.assignedClass ?? null),
    });
  }
}
