import { IStudentRepository } from '../../../../domain/interface/admin/IStudentRepository';
import { IStudent } from '../../../../domain/types/interfaces';
import { ITokenService } from '../../../../domain/interface/ITokenService';
import { sendDefaultPasswordEmail } from '../../../../utils/emailService';
import { Student } from '../../../../domain/entities/student';
import { IAddStudentUseCase } from '../../../../domain/interface/IAddStudentUseCase';
import crypto from 'crypto';

export class AddStudentUseCase implements IAddStudentUseCase {
  constructor(
    private studentRepo: IStudentRepository,
    private authService: ITokenService
  ) {}

  async execute(studentData: Partial<IStudent>): Promise<Student> {
    try {
      const defaultPassword = crypto.randomBytes(8).toString('hex');
      const hashedPassword = await this.authService.hashPassword(defaultPassword);

      const existingStudent = await this.studentRepo.findByEmail(studentData.email!);
      if (existingStudent) {
        throw new Error('Student already exists');
      }

      const fullStudentData: Partial<IStudent> = {
        ...studentData,
        password: hashedPassword,
        isInitialLogin: true,
      };

      const student = await this.studentRepo.create(fullStudentData);
      await sendDefaultPasswordEmail(studentData.email!, defaultPassword);
      return student;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to add student');
    }
  }
}