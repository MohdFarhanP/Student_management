import { TeacherNameDTO } from '../types/interfaces';

export interface IGetAllTeachersUseCase {
  execute(): Promise<TeacherNameDTO[]>;
}