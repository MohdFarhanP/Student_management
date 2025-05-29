import { AttendanceDataDto } from '../../application/dtos/attendanceDtos';

export interface IFetchWeeklyAttendanceUseCase {
  execute(classId: string): Promise<AttendanceDataDto[]>;
}
