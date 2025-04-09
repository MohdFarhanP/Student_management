import { IStudentRepository } from '../../../../domain/interface/admin/IStudentRepository.js';
import { IStudent } from '../../../../domain/interface/IStudent.js';
import { ITokenService } from '../../../../domain/interface/ITokenService.js';
import { sendDefaultPasswordEmail } from '../../../../utils/emailService.js';
import crypto from 'crypto';

export class AddStudentUseCase {
  constructor(
    private studentRepo: IStudentRepository,
    private authService: ITokenService
  ) {}

  async execute(studentData: Partial<IStudent>, role: string = 'Student') {
    const defaultPassword = crypto.randomBytes(8).toString('hex');
    const hashedPassword = await this.authService.hashPassword(defaultPassword);

    const existingStudent = await this.studentRepo.findByEmail(
      studentData.email!
    );
    if (existingStudent) {
      return { id: existingStudent.id, email: existingStudent.email, role };
    }
    const fullStudentData: Partial<IStudent> = {
      ...studentData,
      password: hashedPassword,
      isInitialLogin: true,
    };
    const student = await this.studentRepo.create(fullStudentData);

    await sendDefaultPasswordEmail(studentData.email!, defaultPassword);
    return student;
  }
}
