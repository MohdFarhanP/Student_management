import { studentModel } from '../../database/models/studentModel';
import { ClassModel } from '../../database/models/classModel';
import mongoose from 'mongoose';
import { IStudentRepository } from '../../../domain/interface/admin/IStudentRepository';
import { Student } from '../../../domain/entities/student';
import { IStudent } from '../../../domain/types/interfaces';
import { Gender } from '../../../domain/types/enums';

// Utility function to map MongoDB data to IStudent with Gender enum
const mapToStudentData = (data: any): Partial<IStudent> => ({
  id: data._id?.toString(),
  name: data.name,
  email: data.email,
  roleNumber: data.roleNumber,
  dob: data.dob,
  gender: data.gender === 'Male' ? Gender.Male : Gender.Female, // Map string to enum
  age: data.age,
  class: data.class ? (typeof data.class === 'object' ? data.class.name : data.class) : null,
  profileImage: data.profileImage,
  address: {
    houseName: data.address?.houseName || '',
    place: data.address?.place || '',
    district: data.address?.district || '',
    pincode: data.address?.pincode || 0,
    phoneNo: data.address?.phoneNo || 0,
    guardianName: data.address?.guardianName || '',
    guardianContact: data.address?.guardianContact ?? null,
  },
});


export class StudentRepository implements IStudentRepository {
  async insertMany(students: Student[]): Promise<void> {
    if (!students || students.length === 0) return;
  
    const classMap = new Map<string, string>(); // Cache class name to ObjectId
    const classStudentMap = new Map<string, string[]>(); // classId => studentIds
  
    // Step 1: Convert class name to ObjectId and prepare for bulk insert
    const processedStudents = await Promise.all(
      students.map(async (student) => {
        if (student.class && typeof student.class === 'string') {
          let classId = classMap.get(student.class);
          if (!classId) {
            const classDoc = await ClassModel.findOne({ name: student.class });
            if (!classDoc) throw new Error(`Class '${student.class}' not found`);
            classId = classDoc._id.toString();
            classMap.set(student.class, classId);
          }
          student.class = classId;
  
          // Prepare to push student IDs into class
          if (!classStudentMap.has(classId)) classStudentMap.set(classId, []);
        }
        return student;
      })
    );
  
    // Step 2: Bulk insert students
    const insertedStudents = await studentModel.insertMany(processedStudents);
  
    // Step 3: Organize students by class
    insertedStudents.forEach((student) => {
      const classId = student.class?.toString();
      if (classId) {
        classStudentMap.get(classId)?.push(student._id.toString());
      }
    });
  
    // Step 4: Update each class with students and total count
    for (const [classId, studentIds] of classStudentMap.entries()) {
      await ClassModel.findByIdAndUpdate(
        classId,
        {
          $push: { students: { $each: studentIds } },
          $inc: { totalStudents: studentIds.length },
        },
        { new: true }
      );
    }
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

    const students = rawStudentsData.map((s) => new Student(mapToStudentData(s)));

    const totalCount = await studentModel.countDocuments({ isDeleted: false });
    return { students, totalCount };
  }

  async findById(id: string): Promise<Student | null> {
    const student = await studentModel.findOne({ _id: id, isDeleted: false }).lean();
    if (!student) return null;
    return new Student(mapToStudentData(student));
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
    return new Student(mapToStudentData(newStudent.toObject()));
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
    return new Student(mapToStudentData(updatedStudent));
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
    return new Student(mapToStudentData(rawStudent));
  }

  async findByEmail(email: string): Promise<Student | null> {
    const student = await studentModel.findOne({ email, isDeleted: false }).lean();
    if (!student) return null;
    return new Student(mapToStudentData(student));
  }

  async getStudentsByClass(classId: string): Promise<Student[]> {
    const students = await studentModel
      .find({ class: classId, isDeleted: false })
      .populate('class', 'name')
      .lean();

    return students.map((student) => {
      const studentData = mapToStudentData(student);
      return new Student({
        id: studentData.id,
        name: studentData.name,
        class: studentData.class,
        email: studentData.email,
        profileImage: studentData.profileImage,
      });
    });
  }
  async addStudentToClass(classId: string, studentId: string): Promise<void> {
    await ClassModel.findByIdAndUpdate(
      classId,
      {
        $addToSet: { students: studentId },
        $inc: { totalStudents: 1 },
      },
      { new: true }
    );
  }
  async removeStudentFromClass(classId: string, studentId: string): Promise<void> {
    await ClassModel.findByIdAndUpdate(
      classId,
      {
        $pull: { students: studentId },
        $inc: { totalStudents: -1 },
      },
      { new: true }
    );
  }
  
  
}