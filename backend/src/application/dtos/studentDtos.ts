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
