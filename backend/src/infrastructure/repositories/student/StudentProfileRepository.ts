import { studentModel } from '../../database/models/studentModel.js';
import { Student } from '../../../domain/entities/student.js';
import { IStudentProfileRepository } from '../../../domain/interface/student/IStudentProfileRepository.js';
import mongoose from 'mongoose';

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

export class StudentProfileRepository implements IStudentProfileRepository {
  async getProfile(email: string): Promise<Student | null> {
    const rawStudent = await studentModel
      .findOne({ email })
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

  async updateProfileImage(
    email: string,
    profileImage: string
  ): Promise<Student | null> {
    const rawStudent = await studentModel
      .findOneAndUpdate(
        { email },
        { profileImage },
        { new: true } // Return the updated document
      )
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
}
