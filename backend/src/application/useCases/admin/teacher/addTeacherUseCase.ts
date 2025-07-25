import { ITeacherRepository } from '../../../../domain/repositories/ITeacherRepository';
import { ITeacher } from '../../../../domain/types/interfaces';
import { IAuthService } from '../../../services/IAuthService';
import { TeacherEntity } from '../../../../domain/entities/teacher';
import { IAddTeacherUseCase } from '../../../../domain/useCase/IAddTeacherUseCase';
import { Gender, Day } from '../../../../domain/types/enums';
import crypto from 'crypto';
import { IEmailService } from '../../../services/IEmailService';

export class AddTeacherUseCase implements IAddTeacherUseCase {
  constructor(
    private teacherRepository: ITeacherRepository,
    private authService: IAuthService,
    private emailService: IEmailService
  ) {}

  async execute(teacherData: Partial<ITeacher>): Promise<TeacherEntity> {
    try {
      if (!teacherData.email || !teacherData.name || !teacherData.gender) {
        throw new Error('Email, name, and gender are required');
      }

      if (teacherData.gender && typeof teacherData.gender === 'string') {
        if (
          teacherData.gender !== Gender.Male &&
          teacherData.gender !== Gender.Female
        ) {
          throw new Error(`Invalid gender value: '${teacherData.gender}'`);
        }
        teacherData.gender = teacherData.gender as Gender;
      }

      const availability = teacherData.availability || {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
      };
      if (teacherData.availability) {
        const validDays = [
          Day.Monday,
          Day.Tuesday,
          Day.Wednesday,
          Day.Thursday,
          Day.Friday,
        ];
        for (const day of validDays) {
          availability[day] = Array.isArray(teacherData.availability[day])
            ? teacherData.availability[day]
            : [];
        }
      }

      const defaultPassword = crypto.randomBytes(8).toString('hex');
      const hashedPassword =
        await this.authService.hashPassword(defaultPassword);

      const existingTeacher = await this.teacherRepository.getByEmail(
        teacherData.email
      );
      if (existingTeacher) {
        throw new Error('Teacher already exists');
      }

      const fullTeacherData: Partial<ITeacher> = {
        ...teacherData,
        password: hashedPassword,
        isInitialLogin: true,
        availability,
      };

      const teacher = await this.teacherRepository.create(fullTeacherData);
      await this.emailService.sendDefaultPasswordEmail(
        teacherData.email,
        defaultPassword
      );
      return teacher;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to add teacher');
    }
  }
}
