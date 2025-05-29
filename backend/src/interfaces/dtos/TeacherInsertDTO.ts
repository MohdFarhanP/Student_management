import { Types } from 'mongoose';
import { Day, Gender } from '../../domain/types/enums';

export interface TeacherInsertDTO {
  name: string;
  email: string;
  password?: string;
  gender: Gender;
  phoneNo: number;
  empId: string;
  assignedClass?: Types.ObjectId | null;
  subject?: Types.ObjectId | null;
  dateOfBirth: string;
  profileImage?: string;
  fileHash?: string;
  specialization?: string;
  experienceYears?: number;
  qualification?: string;
  availability?: { [key in Day]?: number[] };
  isInitialLogin?: boolean;
  isDeleted?: boolean;
  refreshToken?: string;
}
