import { ObjectId } from '../../types';
import { Day } from '../types/enums';
import { Teacher } from '../entities/teacher';

export interface IUpdateTeacherAvailabilityUseCase {
  updateAvailability(
    teacherId: ObjectId,
    day: Day,
    period: number,
    isAdding: boolean
  ): Promise<Teacher>;
}