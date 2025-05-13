import { TeacherModel } from '../../database/models/teacherModel';
import { Teacher } from '../../../domain/entities/teacher';
import { ITeacherProfileRepository } from '../../../domain/interface/teacher/ITeacherProfileRepository';
import { ClassModel } from '../../database/models/classModel';
import { SubjectModel } from '../../database/models/subjectModel';
import { Gender } from '../../../domain/types/enums';

export class TeacherProfileRepository implements ITeacherProfileRepository {
  async getProfile(email: string): Promise<Teacher | null> {
    const rawTeacher = await TeacherModel
      .findOne({ email })
      .select('-password')
      .populate('assignedClass', 'name')
      .populate('subject', 'subjectName')
      .lean();

    if (!rawTeacher) return null;

    const classData = rawTeacher.assignedClass as unknown as { name: string } | null;
    const subjectData = rawTeacher.subject as unknown as { subjectName: string } | null;
    return new Teacher({
      id: rawTeacher._id.toString(),
      name: rawTeacher.name,
      email: rawTeacher.email,
      empId: rawTeacher.empId,
      dateOfBirth: rawTeacher.dateOfBirth,
      gender: rawTeacher.gender === 'Male' ? Gender.Male : Gender.Female,
      phoneNo: rawTeacher.phoneNo,
      assignedClass: classData ? classData.name : null,
      subject: subjectData ? subjectData.subjectName : null,
      profileImage: rawTeacher.profileImage,
      specialization: rawTeacher.specialization,
      experienceYears: rawTeacher.experienceYears,
      qualification: rawTeacher.qualification,
    });
  }

  async updateProfile(profile: Partial<Teacher>): Promise<Teacher | null> {
    if (!profile.email) {
      throw new Error('Email is required to update profile');
    }

    const updateData: any = { ...profile };

    if (profile.subject && typeof profile.subject === 'string') {
      const subjectDoc = await SubjectModel.findOne({ subjectName: profile.subject });
      if (!subjectDoc) {
        throw new Error(`Subject '${profile.subject}' not found`);
      }
      updateData.subject = subjectDoc._id;
    }

    if (profile.assignedClass && typeof profile.assignedClass === 'string') {
      const classDoc = await ClassModel.findOne({ name: profile.assignedClass });
      if (!classDoc) {
        throw new Error(`Class '${profile.assignedClass}' not found`);
      }
      updateData.assignedClass = classDoc._id;
    }

    const rawTeacher = await TeacherModel
      .findOneAndUpdate(
        { email: profile.email },
        updateData,
        { new: true, runValidators: true }
      )
      .select('-password')
      .populate('assignedClass', 'name')
      .populate('subject', 'subjectName')
      .lean();

    if (!rawTeacher) return null;

    const classData = rawTeacher.assignedClass as unknown as { name: string } | null;
    const subjectData = rawTeacher.subject as unknown as { subjectName: string } | null;
    return new Teacher({
      id: rawTeacher._id.toString(),
      name: rawTeacher.name,
      email: rawTeacher.email,
      empId: rawTeacher.empId,
      dateOfBirth: rawTeacher.dateOfBirth,
      gender: rawTeacher.gender === 'Male' ? Gender.Male : Gender.Female,
      phoneNo: rawTeacher.phoneNo,
      assignedClass: classData ? classData.name : null,
      subject: subjectData ? subjectData.subjectName : null,
      profileImage: rawTeacher.profileImage,
      specialization: rawTeacher.specialization,
      experienceYears: rawTeacher.experienceYears,
      qualification: rawTeacher.qualification,
    });
  }
}