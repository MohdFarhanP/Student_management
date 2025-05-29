import { Day } from 'date-fns';
import { ObjectId } from '../../domain/types/common';

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
