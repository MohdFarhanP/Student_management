import { sendDefaultPasswordEmail } from '../../../../utils/emailService';
import { ITokenService } from '../../../../domain/interface/ITokenService';
import crypto from 'crypto';
import { ITeacher } from '../../../../domain/interface/ITeacher';
import { ITeacherRepository } from '../../../../domain/interface/admin/ITeacherRepository';

export class AddTeacherUseCase {
  constructor(
    private teacherRepository: ITeacherRepository,
    private authService: ITokenService
  ) {}

  async execute(teacherData: Partial<ITeacher>, role: string = 'Teacher') {
    const defaultPassword = crypto.randomBytes(8).toString('hex');
    const hashedPassword = await this.authService.hashPassword(defaultPassword);

    const existingTeacher = await this.teacherRepository.getByEmail(
      teacherData.email!
    );
    if (existingTeacher) {
      return { id: existingTeacher.id, email: existingTeacher.email, role };
    }

    const fullTeacherData: Partial<ITeacher> = {
      ...teacherData,
      password: hashedPassword,
      isInitialLogin: true,
    };
    const teacher = await this.teacherRepository.create(fullTeacherData);

    await sendDefaultPasswordEmail(teacherData.email!, defaultPassword);
    return teacher;
  }
}
