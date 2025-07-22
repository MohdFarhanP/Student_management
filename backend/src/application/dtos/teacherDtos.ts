import { Day } from 'date-fns';
import { ObjectId } from '../../domain/types/common';
import { TeacherEntity } from '../../domain/entities/teacher';

export interface TeacherNameDTO {
  id: string;
  name: string;
}

export interface TeacherDashboardStats {
  todayClasses: number;
  pendingLeaves: number;
  upcomingSessions: number;
}

export interface TeacherData {
  _id: ObjectId;
  name: string;
  subjects: string[];
  availability: { [key in Day]: number[] };
}
export class TeacherDTO {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly gender: string,
    public readonly phoneNo: number,
    public readonly empId: string,
    public readonly assignedClass: string | null,
    public readonly subject: string | null,
    public readonly dateOfBirth: string,
    public readonly profileImage?: string,
    public readonly specialization?: string,
    public readonly experienceYears?: number,
    public readonly qualification?: string,
    public readonly availability?: { [key: string]: number[] }
  ) {}

  public static fromEntity(entity: TeacherEntity): TeacherDTO {
    return new TeacherDTO(
      entity.id ?? '',
      entity.name,
      entity.email,
      entity.gender,
      entity.phoneNo,
      entity.empId,
      entity.assignedClass ?? null,
      entity.subject ?? null,
      entity.dateOfBirth,
      entity.profileImage,
      entity.specialization,
      entity.experienceYears,
      entity.qualification,
      entity.availability
    );
  }
}
