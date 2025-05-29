import { LeaveStatus } from '../../domain/types/enums';

export interface ApplyForLeaveDTO {
  studentId: string;
  date: string;
  reason: string;
}

export interface ViewLeaveHistoryDTO {
  studentId: string;
  userId: string;
}

export interface ApproveRejectLeaveDTO {
  leaveId: string;
  teacherId: string;
  status: LeaveStatus.Approved | LeaveStatus.Rejected;
}
