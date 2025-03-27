import { TeacherModel } from '../database/models/teacherModel.js';
import { IRepository } from '../../domain/interface/IRepository.js';
import { Teacher } from '../../domain/entities/teacher.js';
import { ClassModel } from '../database/models/classModel.js';
import { SubjectModel } from '../database/models/subjectModel.js';
import mongoose from 'mongoose';
import { ObjectId } from '../../types/index.js';
import { ITeacher } from '../../domain/interface/ITeacher.js';

interface PopulatedTeacher {
  _id: string | mongoose.Types.ObjectId;
  name: string;
  email: string;
  gender: 'Male' | 'Female';
  phoneNo: number;
  empId: string;
  assignedClass?: { name: string } | null;
  subject?: { subjectName: string } | null;
  dateOfBirth: string;
  availability: { [day: string]: number[] };
  profileImage?: string;
  specialization?: string;
  experienceYears?: number;
  qualification?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class TeacherRepository implements IRepository<Teacher> {
  async insertMany(teachers: Teacher[]) {
    if (!teachers || teachers.length === 0) return;

    const processedTeachers = await Promise.all(
      teachers.map(async (teacher) => {
        if (
          teacher.assignedClass &&
          typeof teacher.assignedClass === 'string'
        ) {
          const classDoc = await ClassModel.findOne({
            name: teacher.assignedClass,
          });
          if (!classDoc)
            throw new Error(`Class '${teacher.assignedClass}' not found`);
          teacher.assignedClass = classDoc._id;
        }

        if (teacher.subject && typeof teacher.subject === 'string') {
          const subjectDoc = await SubjectModel.findOne({
            subjectName: teacher.subject,
          });
          if (!subjectDoc)
            throw new Error(`Subject '${teacher.subject}' not found`);
          teacher.subject = subjectDoc._id;
        }

        return teacher;
      })
    );

    await TeacherModel.insertMany(processedTeachers);
  }
  async getAllByLimit(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const rawTeachersData = await TeacherModel.find()
      .skip(skip)
      .limit(limit)
      .select('-password')
      .populate('assignedClass', 'name')
      .populate('subject', 'subjectName')
      .lean();

    const teachersData = rawTeachersData as unknown as PopulatedTeacher[];

    const teachers = teachersData.map((t) => {
      return new Teacher({
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
        specialization: t.specialization || '',
        experienceYears: t.experienceYears || 0,
        qualification: t.qualification || '',
      });
    });

    const totalCount = await TeacherModel.countDocuments();
    return { data: teachers, totalCount };
  }
  async getAll(): Promise<{ data: Teacher[] }> {
    const rawTeachersData = await TeacherModel.find().select('_id name').lean();

    const teachers = rawTeachersData.map((t) => ({
      id: t._id.toString(),
      name: t.name,
      email: '',
      gender: 'Male' as const,
      phoneNo: 0,
      empId: '',
      assignedClass: null,
      subject: null,
      dateOfBirth: '',
      profileImage: '',
      specialization: '',
      experienceYears: 0,
      qualification: '',
      availability: {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
      },
    }));

    return { data: teachers };
  }
  async getById(teacherId: ObjectId | string): Promise<Teacher> {
    const rawTeacher = await TeacherModel.findById(teacherId)
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
      assignedClass: teacherData.assignedClass
        ? teacherData.assignedClass.name
        : null,
      subject: teacherData.subject ? teacherData.subject.subjectName : null,
      dateOfBirth: teacherData.dateOfBirth,
      profileImage: teacherData.profileImage || '',
      specialization: teacherData.specialization || '',
      experienceYears: teacherData.experienceYears || 0,
      qualification: teacherData.qualification || '',
      availability: teacherData.availability,
    });
  }
  async save(teacher: Teacher): Promise<void> {
    try {
      await TeacherModel.findByIdAndUpdate(teacher.id, {
        availability: teacher.availability,
      });
    } catch (error) {
      throw new Error(`Failed to save teacher: ${(error as Error).message}`);
    }
  }
  async update(id: string, data: Partial<ITeacher>): Promise<Teacher> {
    const updatedTeacher = await TeacherModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedTeacher) {
      throw new Error('Teacher not found or update failed');
    }

    return new Teacher({
      id: updatedTeacher._id.toString(),
      name: updatedTeacher.name,
      email: updatedTeacher.email,
      gender: updatedTeacher.gender,
      phoneNo: updatedTeacher.phoneNo,
      empId: updatedTeacher.empId,
      assignedClass: updatedTeacher.assignedClass,
      subject: updatedTeacher.subject,
      dateOfBirth: updatedTeacher.dateOfBirth,
      profileImage: updatedTeacher.profileImage,
      specialization: updatedTeacher.specialization,
      experienceYears: updatedTeacher.experienceYears,
      qualification: updatedTeacher.qualification,
    });
  }
  async create(data: Partial<ITeacher>): Promise<Teacher> {
    if (data.subject && typeof data.subject === 'string') {
      const subjectDoc = await SubjectModel.findOne({
        subjectName: data.subject,
      });
      if (!subjectDoc) {
        throw new Error(`Subject '${data.subject}' not found`);
      }
      data.subject = subjectDoc._id;
    }

    if (data.assignedClass && typeof data.assignedClass === 'string') {
      const classDoc = await ClassModel.findOne({
        name: data.assignedClass,
      });
      if (!classDoc) {
        throw new Error(`Class '${data.assignedClass}' not found`);
      }
      data.assignedClass = classDoc._id;
    }

    const newTeacher = await TeacherModel.create(data);
    return new Teacher({
      id: newTeacher._id.toString(),
      name: newTeacher.name,
      email: newTeacher.email,
      gender: newTeacher.gender,
      phoneNo: newTeacher.phoneNo,
      empId: newTeacher.empId,
      assignedClass: newTeacher.assignedClass,
      subject: newTeacher.subject,
      dateOfBirth: newTeacher.dateOfBirth,
      profileImage: newTeacher.profileImage,
      specialization: newTeacher.specialization,
      experienceYears: newTeacher.experienceYears,
      qualification: newTeacher.qualification,
      availability: newTeacher.availability,
    });
  }
  async delete(id: string): Promise<void> {
    const result = await TeacherModel.findByIdAndDelete(id);
    if (!result) {
      throw new Error('Teacher not found or already deleted');
    }
  }
}
