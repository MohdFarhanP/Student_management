import { IStudentProfileRepository } from '../../../domain/interface/student/IStudentProfileRepository';
import { IGetStudentInfoUseCase } from '../../../domain/interface/IGetStudentInfoUseCase';
import { studentInfoDto } from '../../../domain/types/interfaces';

export class GetStudentInfoUseCase implements IGetStudentInfoUseCase {
  constructor(private studentRepository: IStudentProfileRepository) {}

  async execute(userId: string): Promise<studentInfoDto | null> {
    try {

      const studentInfo = await this.studentRepository.getStudentInfo(userId);
      
      if (!studentInfo) {
        throw new Error('Student Info not found');
      }
      return {
        id:studentInfo.id,
        name:studentInfo.name,
        email:studentInfo.email
    };
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch student profile');
    }
  }
}