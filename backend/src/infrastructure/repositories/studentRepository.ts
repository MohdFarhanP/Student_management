import { studentModel } from '../database/models/studentModel.js';
import { IRepository } from '../../domain/interface/IRepository.js';
import { Student } from '../../domain/entities/student.js';
import mongoose from 'mongoose';

export class StudentRepository implements IRepository<Student> {
  async insertMany(students: Student[]) {
    if (!students || students.length === 0) {
      return;
    }
    await studentModel.insertMany(students);
  }
  async getAll(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const studentsData = await studentModel
      .find()
      .skip(skip)
      .limit(limit)
      .select('-password')
      .lean();

    const students = studentsData.map(
      (s) =>
        new Student({
          id: s._id.toString(),
          name: s.name,
          email: s.email,
          roleNumber: s.roleNumber,
          dob: s.dob,
          gender: s.gender,
          age: s.age,
          class: s.class?.toString() || null,
          subjectIds:
            s.subjectIds?.map((id: mongoose.Types.ObjectId) => id.toString()) ||
            [],
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
        })
    );

    const totalCount = await studentModel.countDocuments();
    return { data: students, totalCount };
  }
}
