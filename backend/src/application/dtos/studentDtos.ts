import { StudentEntity } from '../../domain/entities/student';
import { Gender } from '../../domain/types/enums';

export interface StudentIdsDTO {
  studentIds: string[];
}

export interface studentInfoDto {
  id: string;
  name: string;
  email: string;
}

export interface StudentDashboardStats {
  attendancePercentage: number;
  pendingLeaves: number;
  upcomingSessions: number;
}

export class StudentDTO {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public roleNumber: string,
    public dob: string,
    public gender: Gender,
    public age: number,
    public studentClass: string | null,
    public profileImage?: string,
    public address?: {
      houseName: string;
      place: string;
      district: string;
      pincode: number;
      phoneNo: number;
      guardianName: string;
      guardianContact?: string | null;
    }
  ) {}

  public static fromEntity(entity: StudentEntity): StudentDTO {
    return new StudentDTO(
      entity.id ?? '',
      entity.name,
      entity.email,
      entity.roleNumber,
      entity.dob,
      entity.gender,
      entity.age,
      entity.class ?? null,
      entity.profileImage,
      entity.address
    );
  }
}
