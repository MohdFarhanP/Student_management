import { SessionAttendanceDTO } from '../../application/dtos/liveSessionDtos';

export interface IGetRecentSessionAttendanceUseCase {
  execute(teacherId: string, limit?: number): Promise<SessionAttendanceDTO[]>;
}
