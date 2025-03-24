import { studentModel } from '../database/models/studentModel.js';
import { Student } from '../../domain/entities/student.js';
import { ClassModel } from '../database/models/classModel.js';
import mongoose from 'mongoose';
import { IStudentRepository } from '../../domain/interface/IStudentRepository.js';

interface PopulatedStudent {
  _id: string | mongoose.Types.ObjectId;
  name: string;
  email: string;
  roleNumber: string;
  dob: string;
  gender: 'Male' | 'Female';
  age: number;
  class?: { name: string } | null;
  profileImage?: string;
  address: {
    houseName: string;
    place: string;
    district: string;
    pincode: number;
    phoneNo: number;
    guardianName: string;
    guardianContact?: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
}

export class StudentRepository implements IStudentRepository {
  async insertMany(students: Student[]) {
    if (!students || students.length === 0) return;

    const processedStudents = await Promise.all(
      students.map(async (student) => {
        if (student.class && typeof student.class === 'string') {
          const classDoc = await ClassModel.findOne({ name: student.class });
          if (!classDoc) throw new Error(`Class '${student.class}' not found`);
          student.class = classDoc._id;
        }
        return student;
      })
    );

    await studentModel.insertMany(processedStudents);
  }
  async getAll(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const rawStudentsData = await studentModel
      .find()
      .skip(skip)
      .limit(limit)
      .select('-password')
      .populate('class', 'name')
      .lean();

    const studentsData = rawStudentsData as unknown as PopulatedStudent[];

    const students = studentsData.map((s) => {
      return new Student({
        id: s._id.toString(),
        name: s.name,
        email: s.email,
        roleNumber: s.roleNumber,
        dob: s.dob,
        gender: s.gender,
        age: s.age,
        class: s.class ? s.class.name : null,
        profileImage: s.profileImage,
        address: {
          houseName: s.address?.houseName || '',
          place: s.address?.place || '',
          district: s.address?.district || '',
          pincode: s.address?.pincode || 0,
          phoneNo: s.address?.phoneNo || 0,
          guardianName: s.address?.guardianName || '',
          guardianContact: s.address?.guardianContact || null,
        },
      });
    });

    const totalCount = await studentModel.countDocuments();
    return { students, totalCount };
  }
}
