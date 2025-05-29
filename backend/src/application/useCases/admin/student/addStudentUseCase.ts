import { IStudentRepository } from '../../../../domain/repositories/IStudentRepository';
import { IStudent } from '../../../../domain/types/interfaces';
import { IAuthService } from '../../../services/IAuthService';
import { StudentEntity } from '../../../../domain/entities/student';
import { IAddStudentUseCase } from '../../../../domain/useCase/IAddStudentUseCase';
import crypto from 'crypto';
import { IEmailService } from '../../../services/IEmailService';

export class AddStudentUseCase implements IAddStudentUseCase {
  constructor(
    private studentRepo: IStudentRepository,
    private authService: IAuthService,
    private emailService: IEmailService
  ) {}

  async execute(studentData: Partial<IStudent>): Promise<StudentEntity> {
    try {
      const defaultPassword = crypto.randomBytes(8).toString('hex');
      const hashedPassword =
        await this.authService.hashPassword(defaultPassword);

      const existingStudent = await this.studentRepo.findByEmail(
        studentData.email!
      );
      if (existingStudent) {
        throw new Error('Student already exists');
      }

      const fullStudentData: Partial<IStudent> = {
        ...studentData,
        password: hashedPassword,
        isInitialLogin: true,
      };

      const student = await this.studentRepo.create(fullStudentData);

      if (student.class) {
        await this.studentRepo.addStudentToClass(
          student.class.toString(),
          student.id.toString()
        );
      }

      await this.emailService.sendDefaultPasswordEmail(
        studentData.email!,
        defaultPassword
      );
      return student;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to add student');
    }
  }
}
