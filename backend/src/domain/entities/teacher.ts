import mongoose from 'mongoose';
import { ITeacher } from '../types/interfaces';
import { Gender, Day } from '../types/enums';

export class Teacher implements ITeacher {
  id?: string;
  name: string;
  email: string;
  password?: string;
  gender: Gender;
  phoneNo: number;
  empId: string;
  assignedClass?: mongoose.Types.ObjectId | string | null;
  subject?: mongoose.Types.ObjectId | string | null;
  dateOfBirth: string;
  profileImage?: string;
  fileHash?: string;
  specialization?: string;
  experienceYears?: number;
  qualification?: string;
  availability?: { [key in Day]: number[] };

  constructor(data: Partial<ITeacher>) {
    this.id = data.id;
    this.name = data.name || 'Unknown';
    this.email = data.email || '';
    this.password = data.password;
    this.gender = data.gender || Gender.Male;
    this.phoneNo = data.phoneNo || 0;
    this.empId = data.empId || '';
    this.assignedClass = data.assignedClass || null;
    this.subject = data.subject || undefined;
    this.dateOfBirth = data.dateOfBirth || '';
    this.profileImage = data.profileImage || '';
    this.fileHash = data.fileHash || '';
    this.specialization = data.specialization || '';
    this.experienceYears = data.experienceYears || 0;
    this.qualification = data.qualification || '';
    this.availability = data.availability || undefined;
  }
}