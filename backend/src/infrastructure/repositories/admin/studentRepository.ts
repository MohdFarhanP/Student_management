import { studentModel } from '../../database/models/studentModel';
import { ClassModel } from '../../database/models/classModel';
import mongoose from 'mongoose';
import { IStudentRepository } from '../../../domain/interface/admin/IStudentRepository';
import { Student } from '../../../domain/entities/student';
import { IStudent } from '../../../domain/types/interfaces';

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
    guardianContact?: string | null | undefined;
  };
  createdAt: Date;
  updatedAt: Date;
}

export class StudentRepository implements IStudentRepository {
  async insertMany(students: Student[]): Promise<void> {
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

  async getAll(page: number, limit: number): Promise<{ students: Student[]; totalCount: number }> {
    const skip = (page - 1) * limit;

    const rawStudentsData = await studentModel
      .find({ isDeleted: false })
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
          houseName: s.address.houseName,
          place: s.address.place,
          district: s.address.district,
          pincode: s.address.pincode,
          phoneNo: s.address.phoneNo,
          guardianName: s.address.guardianName,
          guardianContact: s.address.guardianContact ?? null,
        },
      });
    });

    const totalCount = await studentModel.countDocuments({ isDeleted: false });
    return { students, totalCount };
  }

  async findById(id: string): Promise<Student | null> {
    const student = await studentModel.findOne({ _id: id, isDeleted: false }).lean();
    if (!student) return null;
    return new Student({ ...student, id: student._id.toString() });
  }

  async create(data: Partial<IStudent>): Promise<Student> {
    const existStudent = await studentModel.findOne({ email: data.email, isDeleted: false });
    if (existStudent) {
      throw new Error('Student already exists');
    }
    if (data.class && typeof data.class === 'string') {
      const classDoc = await ClassModel.findOne({ name: data.class });
      if (!classDoc) throw new Error(`Class '${data.class}' not found`);
      data.class = classDoc._id;
    }
    const studentEntity = new Student(data);

    const newStudent = await studentModel.create(studentEntity);
    return new Student({
      ...newStudent.toObject(),
      id: newStudent._id.toString(),
    });
  }

  async update(id: string, data: Partial<IStudent>): Promise<Student> {
    if (data.class && typeof data.class === 'string') {
      const classDoc = await ClassModel.findOne({ name: data.class });
      if (!classDoc) throw new Error(`Class '${data.class}' not found`);
      data.class = classDoc._id;
    }
    const updatedStudent = await studentModel
      .findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
      .lean();
    if (!updatedStudent) throw new Error('Student not found');
    return new Student({
      ...updatedStudent,
      id: updatedStudent._id.toString(),
    });
  }

  async delete(id: string): Promise<void> {
    const result = await studentModel.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true }
    );
    if (!result) throw new Error('Student not found');
  }

  async getProfile(email: string): Promise<Student | null> {
    const rawStudent = await studentModel
      .findOne({ email, isDeleted: false })
      .select('-password')
      .populate('class', 'name')
      .lean();

    if (!rawStudent) return null;

    const studentData = rawStudent as unknown as PopulatedStudent;
    return new Student({
      id: studentData._id.toString(),
      name: studentData.name,
      email: studentData.email,
      roleNumber: studentData.roleNumber,
      dob: studentData.dob,
      gender: studentData.gender,
      age: studentData.age,
      class: studentData.class ? studentData.class.name : null,
      profileImage: studentData.profileImage,
      address: {
        houseName: studentData.address.houseName,
        place: studentData.address.place,
        district: studentData.address.district,
        pincode: studentData.address.pincode,
        phoneNo: studentData.address.phoneNo,
        guardianName: studentData.address.guardianName,
        guardianContact: studentData.address.guardianContact ?? null,
      },
    });
  }

  async findByEmail(email: string): Promise<Student | null> {
    const student = await studentModel.findOne({ email, isDeleted: false });
    return student ? new Student(student) : null;
  }

  async getStudentsByClass(classId: string): Promise<Student[]> {
    const students = await studentModel
      .find({ class: classId, isDeleted: false })
      .populate('class', 'name')
      .exec();

    return students.map((student) => {
      const populatedClass = student.class as unknown as { name: string } | null;

      return new Student({
        id: student._id.toString(),
        name: student.name,
        class: populatedClass?.name ?? null,
        email: student.email,
        profileImage: student?.profileImage,
      });
    });
  }
}