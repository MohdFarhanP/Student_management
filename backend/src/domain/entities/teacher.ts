import { Gender, Day } from '../types/enums';

export class TeacherEntity {
  id?: string;
  name: string;
  email: string;
  password?: string;
  gender: Gender;
  phoneNo: number;
  empId: string;
  assignedClass?: string | null;
  subject?: string | null;
  dateOfBirth: string;
  profileImage?: string;
  fileHash?: string;
  specialization?: string;
  experienceYears?: number;
  qualification?: string;
  refreshToken?: string;
  availability?: { [key in Day]?: number[] };

  constructor(data: {
    id?: string;
    name: string;
    email: string;
    password?: string;
    gender: Gender;
    phoneNo: number;
    empId: string;
    assignedClass?: string | null;
    subject?: string | null;
    dateOfBirth: string;
    profileImage?: string;
    fileHash?: string;
    specialization?: string;
    experienceYears?: number;
    qualification?: string;
    refreshToken?: string;
    availability?: { [key in Day]?: number[] };
  }) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.gender = data.gender;
    this.phoneNo = data.phoneNo;
    this.empId = data.empId;
    this.assignedClass = data.assignedClass ?? null;
    this.subject = data.subject ?? null;
    this.dateOfBirth = data.dateOfBirth;
    this.profileImage = data.profileImage ?? '';
    this.fileHash = data.fileHash ?? '';
    this.specialization = data.specialization ?? '';
    this.experienceYears = data.experienceYears ?? 0;
    this.qualification = data.qualification ?? '';
    this.refreshToken = data.refreshToken;
    this.availability = data.availability;
  }
}
