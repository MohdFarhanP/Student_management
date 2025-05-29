import { ObjectId } from '../types/common';
import { Day } from '../types/enums';
import { TeacherEntity as Teacher } from '../entities/teacher';

export interface IUpdateTeacherAvailabilityUseCase {
  updateAvailability(
    teacherId: ObjectId,
    day: Day,
    period: number,
    isAdding: boolean
  ): Promise<Teacher>;
}
