import { TeacherModel } from '../../database/models/teacherModel';
import { ITeacherRepository } from '../../../domain/interface/admin/ITeacherRepository';
import { Teacher } from '../../../domain/entities/teacher';
import { ClassModel } from '../../database/models/classModel';
import { SubjectModel } from '../../database/models/subjectModel';
import mongoose, { Types } from 'mongoose';
import { ObjectId } from '../../../types';
import { ITeacher } from '../../../domain/types/interfaces';
import { Gender } from '../../../domain/types/enums';
import { Day } from '../../../domain/types/enums';

interface PopulatedTeacher {
  _id: string | mongoose.Types.ObjectId;
  name: string;
  email: string;
  gender: Gender;
  phoneNo: number;
  empId: string;
  assignedClass?: { name: string } | null;
  subject?: { subjectName: string } | null;
  dateOfBirth: string;
  availability: { [key in Day]: number[] };
  profileImage?: string;
  fileHash?: string;
  specialization?: string;
  experienceYears?: number;
  qualification?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class TeacherRepository implements ITeacherRepository {
  async insertMany(teachers: Teacher[]): Promise<void> {
    if (!teachers || teachers.length === 0) return;

    const processedTeachers = await Promise.all(
      teachers.map(async (teacher) => {
        if (teacher.assignedClass && typeof teacher.assignedClass === 'string') {
          const classDoc = await ClassModel.findOne({ name: teacher.assignedClass });
          if (!classDoc) throw new Error(`Class '${teacher.assignedClass}' not found`);
          teacher.assignedClass = classDoc._id;
        }
        if (teacher.subject && typeof teacher.subject === 'string') {
          const subjectDoc = await SubjectModel.findOne({ subjectName: teacher.subject });
          if (!subjectDoc) throw new Error(`Subject '${teacher.subject}' not found`);
          teacher.subject = subjectDoc._id;
        }
        return teacher;
      })
    );

    await TeacherModel.insertMany(processedTeachers);
  }

  async getAllByLimit(page: number, limit: number): Promise<{ data: Teacher[]; totalCount: number }> {
    const skip = (page - 1) * limit;
    const rawTeachersData = await TeacherModel.find({ isDeleted: false })
      .skip(skip)
      .limit(limit)
      .select('-password')
      .select('-availability')
      .populate('assignedClass', 'name')
      .populate('subject', 'subjectName')
      .lean();

    const teachersData = rawTeachersData as unknown as PopulatedTeacher[];

    const teachers = teachersData.map((t) => new Teacher({
      id: t._id.toString(),
      name: t.name,
      email: t.email,
      gender: t.gender,
      phoneNo: t.phoneNo,
      empId: t.empId,
      assignedClass: t.assignedClass ? t.assignedClass.name : null,
      subject: t.subject ? t.subject.subjectName : null,
      dateOfBirth: t.dateOfBirth,
      profileImage: t.profileImage || '',
      fileHash: t.fileHash,
      specialization: t.specialization || '',
      experienceYears: t.experienceYears || 0,
      qualification: t.qualification || '',
    }));

    const totalCount = await TeacherModel.countDocuments({ isDeleted: false });
    return { data: teachers, totalCount };
  }

  async getAll(): Promise<{ data: Teacher[] }> {
    const rawTeachersData = await TeacherModel.find({ isDeleted: false })
      .select('-password')
      .populate('assignedClass', 'name')
      .populate('subject', 'subjectName')
      .lean();

    const teachersData = rawTeachersData as unknown as PopulatedTeacher[];

    const teachers = teachersData.map((t) => new Teacher({
      id: t._id.toString(),
      name: t.name,
      email: t.email,
      gender: t.gender,
      phoneNo: t.phoneNo,
      empId: t.empId,
      assignedClass: t.assignedClass ? t.assignedClass.name : null,
      subject: t.subject ? t.subject.subjectName : null,
      dateOfBirth: t.dateOfBirth,
      profileImage: t.profileImage || '',
      fileHash: t.fileHash,
      specialization: t.specialization || '',
      experienceYears: t.experienceYears || 0,
      qualification: t.qualification || '',
    }));

    return { data: teachers };
  }

  async getById(teacherId: ObjectId | string): Promise<Teacher> {
    const rawTeacher = await TeacherModel.findOne({ _id: teacherId, isDeleted: false })
      .populate('assignedClass', 'name')
      .populate('subject', 'subjectName')
      .lean();

    if (!rawTeacher) throw new Error('Teacher not found');

    const teacherData = rawTeacher as unknown as PopulatedTeacher;

    return new Teacher({
      id: teacherData._id.toString(),
      name: teacherData.name,
      email: teacherData.email,
      gender: teacherData.gender,
      phoneNo: teacherData.phoneNo,
      empId: teacherData.empId,
      assignedClass: teacherData.assignedClass ? teacherData.assignedClass.name : null,
      subject: teacherData.subject ? teacherData.subject.subjectName : null,
      dateOfBirth: teacherData.dateOfBirth,
      profileImage: teacherData.profileImage || '',
      fileHash: teacherData.fileHash,
      specialization: teacherData.specialization || '',
      experienceYears: teacherData.experienceYears || 0,
      qualification: teacherData.qualification || '',
      availability: teacherData.availability,
    });
  }

  async getByEmail(email: string): Promise<Teacher | null> {
    const rawTeacher = await TeacherModel.findOne({ email, isDeleted: false })
      .populate('assignedClass', 'name')
      .populate('subject', 'subjectName')
      .lean();

    if (!rawTeacher) return null;

    const teacherData = rawTeacher as unknown as PopulatedTeacher;

    return new Teacher({
      id: teacherData._id.toString(),
      name: teacherData.name,
      email: teacherData.email,
      gender: teacherData.gender,
      phoneNo: teacherData.phoneNo,
      empId: teacherData.empId,
      assignedClass: teacherData.assignedClass ? teacherData.assignedClass.name : null,
      subject: teacherData.subject ? teacherData.subject.subjectName : null,
      dateOfBirth: teacherData.dateOfBirth,
      profileImage: teacherData.profileImage || '',
      fileHash: teacherData.fileHash,
      specialization: teacherData.specialization || '',
      experienceYears: teacherData.experienceYears || 0,
      qualification: teacherData.qualification || '',
    });
  }

  async update(id: string, data: Partial<ITeacher>): Promise<Teacher> {
    if (data.subject && typeof data.subject === 'string') {
      const subjectDoc = await SubjectModel.findOne({ subjectName: data.subject });
      if (!subjectDoc) throw new Error(`Subject '${data.subject}' not found`);
      data.subject = subjectDoc._id;
    }
    if (data.assignedClass) {
      console.log('assignedClass',data.assignedClass)
      const classDoc = await ClassModel.findById(data.assignedClass);
      console.log('this is classDoc from teacher repo', classDoc);
      if (!classDoc) throw new Error(`Class '${data.assignedClass}' not found`);
      data.assignedClass = classDoc._id;
    }
    if (data.gender && typeof data.gender === 'string') {
      if (data.gender !== Gender.Male && data.gender !== Gender.Female) {
        throw new Error(`Invalid gender value: '${data.gender}'`);
      }
      data.gender = data.gender as Gender;
    }
    const updatedTeacher = await TeacherModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    )
      .populate('assignedClass', 'name')
      .populate('subject', 'subjectName')
      .lean();

    if (!updatedTeacher) throw new Error('Teacher not found or update failed');

    const teacherData = updatedTeacher as unknown as PopulatedTeacher;

    return new Teacher({
      id: teacherData._id.toString(),
      name: teacherData.name,
      email: teacherData.email,
      gender: teacherData.gender,
      phoneNo: teacherData.phoneNo,
      empId: teacherData.empId,
      assignedClass: teacherData.assignedClass ? teacherData.assignedClass.name : null,
      dateOfBirth: teacherData.dateOfBirth,
      profileImage: teacherData.profileImage || '',
      fileHash: teacherData.fileHash,
      specialization: teacherData.specialization || '',
      experienceYears: teacherData.experienceYears || 0,
      qualification: teacherData.qualification || '',
    });
  }

  async create(data: Partial<ITeacher>): Promise<Teacher> {
    if (data.subject && typeof data.subject === 'string') {
      const subjectDoc = await SubjectModel.findOne({ subjectName: data.subject });
      if (!subjectDoc) throw new Error(`Subject '${data.subject}' not found`);
      data.subject = subjectDoc._id;
    }
    if (data.assignedClass && typeof data.assignedClass === 'string') {
      const classDoc = await ClassModel.findOne({ name: data.assignedClass });
      if (!classDoc) throw new Error(`Class '${data.assignedClass}' not found`);
      data.assignedClass = classDoc._id;
    }
    if (data.gender && typeof data.gender === 'string') {
      if (data.gender !== Gender.Male && data.gender !== Gender.Female) {
        throw new Error(`Invalid gender value: '${data.gender}'`);
      }
      data.gender = data.gender as Gender;
    }
    const newTeacher = await TeacherModel.create(data);
    const populatedTeacher = await TeacherModel.findById(newTeacher._id)
      .populate('assignedClass', 'name')
      .populate('subject', 'subjectName')
      .lean();

    if (!populatedTeacher) throw new Error('Failed to create teacher');

    const teacherData = populatedTeacher as unknown as PopulatedTeacher;

    return new Teacher({
      id: teacherData._id.toString(),
      name: teacherData.name,
      email: teacherData.email,
      gender: teacherData.gender,
      phoneNo: teacherData.phoneNo,
      empId: teacherData.empId,
      assignedClass: teacherData.assignedClass ? teacherData.assignedClass.name : null,
      subject: teacherData.subject ? teacherData.subject.subjectName : null,
      dateOfBirth: teacherData.dateOfBirth,
      profileImage: teacherData.profileImage || '',
      fileHash: teacherData.fileHash,
      specialization: teacherData.specialization || '',
      experienceYears: teacherData.experienceYears || 0,
      qualification: teacherData.qualification || '',
    });
  }
  
  async save(teacher: Teacher): Promise<void> {
    const updateData = {
      name: teacher.name,
      email: teacher.email,
      empId: teacher.empId,
      dateOfBirth: teacher.dateOfBirth,
      gender: teacher.gender,
      phoneNo: teacher.phoneNo,
      assignedClass: teacher.assignedClass ? new Types.ObjectId(teacher.assignedClass) : null,
      subject: teacher.subject ? new Types.ObjectId(teacher.subject) : null,
      profileImage: teacher.profileImage,
      fileHash: teacher.fileHash,
      specialization: teacher.specialization,
      experienceYears: teacher.experienceYears,
      qualification: teacher.qualification,
    };

    await TeacherModel.findByIdAndUpdate(
      new Types.ObjectId(teacher.id),
      { $set: updateData },
      { runValidators: true }
    );
  }

  async delete(id: string): Promise<void> {
    const result = await TeacherModel.findByIdAndUpdate(id, { isDeleted: true });
    if (!result) throw new Error('Teacher not found or already deleted');
  }
}