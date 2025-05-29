import { ILiveSessionRepository } from '../../../domain/repositories/ILiveSessionRepository';
import { SessionAttendanceDTO } from '../../dtos/liveSessionDtos';
import { StudentAttendance } from '../../dtos/attendanceDtos';
import { ISessionDurationRepository } from '../../../domain/repositories/ISessionDurationRepository';
import { IStudentRepository } from '../../../domain/repositories/IStudentRepository';
import { IGetRecentSessionAttendanceUseCase } from '../../../domain/useCase/IGetRecentSessionAttendanceUseCase';

export class GetRecentSessionAttendanceUseCase
  implements IGetRecentSessionAttendanceUseCase
{
  constructor(
    private readonly sessionRepository: ILiveSessionRepository,
    private readonly sessionDurationRepository: ISessionDurationRepository,
    private readonly studentRepository: IStudentRepository
  ) {}

  async execute(
    teacherId: string,
    limit: number = 5
  ): Promise<SessionAttendanceDTO[]> {
    const sessions = await this.sessionRepository.findSessionByTeacherId(
      teacherId,
      limit
    );

    const result: SessionAttendanceDTO[] = [];
    for (const session of sessions) {
      const durations = await this.sessionDurationRepository.findBySessionId(
        session.id
      );

      const filteredDurations = durations.filter(
        (duration) => duration.durationSeconds < 3600
      );

      if (filteredDurations.length === 0) continue;

      const studentIds = filteredDurations.map((duration) => duration.userId);

      const studentsData =
        await this.studentRepository.findManyByIds(studentIds);

      // Map student data to a dictionary for quick lookup
      const studentMap = new Map<string, string>();
      studentsData.forEach((student) => {
        studentMap.set(student.id, student.name);
      });

      // Map durations to StudentAttendance with names
      const students: StudentAttendance[] = filteredDurations.map(
        (duration) => ({
          studentId: duration.userId,
          studentName: studentMap.get(duration.userId) || 'Unknown Student',
          durationSeconds: duration.durationSeconds,
          joinTime: duration.joinTime,
          leaveTime: duration.leaveTime,
        })
      );

      result.push({
        sessionId: session.id,
        title: session.title,
        scheduledAt: session.scheduledAt,
        students,
      });
    }

    return result;
  }
}
