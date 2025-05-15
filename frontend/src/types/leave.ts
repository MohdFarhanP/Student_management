export enum LeaveStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export interface Leave {
  id: string;
  studentId: string;
  date: string;
  reason: string;
  status: LeaveStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ApplyForm {
  date: string;
  reason: string;
}