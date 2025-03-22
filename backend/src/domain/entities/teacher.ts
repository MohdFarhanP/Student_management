import mongoose from 'mongoose';

export class Teacher {
  id?: string;
  name: string;
  email: string;
  password?: string;
  gender: 'Male' | 'Female';
  phoneNo: number;
  empId: string;
  assignedClass?: mongoose.Types.ObjectId | string | null;
  subject?: mongoose.Types.ObjectId | string | null;
  dateOfBirth: string;
  profileImage?: string;
  specialization?: string;
  experienceYears?: number;
  qualification?: string;

  constructor(data: Partial<Teacher>) {
    this.id = data.id;
    this.name = data.name || 'Unknown';
    this.email = data.email || '';
    this.gender = data.gender || 'Male';
    this.phoneNo = data.phoneNo || 0;
    this.empId = data.empId || '';
    this.assignedClass = data.assignedClass || null;
    this.subject = data.subject || null;
    this.dateOfBirth = data.dateOfBirth || '';
    this.profileImage = data.profileImage || '';
    this.specialization = data.specialization || '';
    this.experienceYears = data.experienceYears || 0;
    this.qualification = data.qualification || '';
  }
}
