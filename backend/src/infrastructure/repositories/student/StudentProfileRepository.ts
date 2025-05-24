import { studentModel } from '../../database/models/studentModel';
import { Student } from '../../../domain/entities/student';
import { IStudentProfileRepository } from '../../../domain/interface/student/IStudentProfileRepository';
import { Gender } from '../../../domain/types/enums';

export class StudentProfileRepository implements IStudentProfileRepository {
  async getProfile(email: string): Promise<Student | null> {
    const rawStudent = await studentModel
      .findOne({ email })
      .select('-password')
      .populate('class', 'name')
      .lean();

    if (!rawStudent) return null;

    const classData = rawStudent.class as unknown as { name: string } | null;
    return new Student({
      id: rawStudent._id.toString(),
      name: rawStudent.name,
      email: rawStudent.email,
      roleNumber: rawStudent.roleNumber,
      dob: rawStudent.dob,
      gender: rawStudent.gender === 'Male' ? Gender.Male : Gender.Female,
      age: rawStudent.age,
      class: classData ? classData.name : null,
      profileImage: rawStudent.profileImage,
      address: {
        houseName: rawStudent.address.houseName,
        place: rawStudent.address.place,
        district: rawStudent.address.district,
        pincode: rawStudent.address.pincode,
        phoneNo: rawStudent.address.phoneNo,
        guardianName: rawStudent.address.guardianName,
        guardianContact: rawStudent.address.guardianContact ?? null,
      },
    });
  }
  async getStudentInfo(userId: string): Promise<Student | null> {
    try {
      const rawStudent = await studentModel
      .findOne({ _id: userId })
      .select('-password')
      .lean();

      if (!rawStudent) return null;
      return new Student(rawStudent);
    } catch (error) {
      throw new Error(error)
    }
  }

  async updateProfileImage(
    email: string,
    profileImage: string,
    fileHash: string,
  ): Promise<Student | null> {
 const rawStudent = await studentModel
      .findOneAndUpdate(
        { email },
        { profileImage, fileHash },
        {new: true}
      )
      .select('-password')
      .populate('class', 'name')
      .lean();
      

  if (!rawStudent) return null;

   return new Student(rawStudent);
  }
}