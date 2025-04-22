import { UserRepository } from '../repositories/userRepository';
import { AuthService } from '../../application/services/authService';
import { LoginUseCase } from '../../application/useCases/auth/LoginUseCase';
import { UpdatePasswordUseCase } from '../../application/useCases/auth/UpdatePasswordUseCase';
import { RefreshTokenUseCase } from '../../application/useCases/auth/RefreshTokenUseCase';
import { LogoutUseCase } from '../../application/useCases/auth/LogoutUseCase';
import { UserController } from '../../controllers/UserController';
import { ILoginUseCase } from '../../domain/interface/ILoginUseCase';
import { IUpdatePasswordUseCase } from '../../domain/interface/IUpdatePasswordUseCase';
import { IRefreshTokenUseCase } from '../../domain/interface/IRefreshTokenUseCase';
import { ILogoutUseCase } from '../../domain/interface/ILogoutUseCase';
import { IUserRepository } from '../../domain/interface/IUserRepository';
import { ITokenService } from '../../domain/interface/ITokenService';
import { IUserController } from '../../domain/interface/IUserController';

import { StudentRepository } from '../repositories/admin/studentRepository';
import { TeacherRepository } from '../repositories/admin/teacherRepository';
import { StudentExcelParser } from '../parsers/studentExcelParser';
import { TeacherExcelParser } from '../parsers/teacherExcelParser';
import { BulkUploadStudentUseCase } from '../../application/useCases/admin/student/bulkUploadStudentUseCase';
import { BulkUploadTeacherUseCase } from '../../application/useCases/admin/teacher/bulkUploadTeachersUseCase';
import { BulkUploadController } from '../../controllers/admin/bulkUploadController';
import { IStudentRepository } from '../../domain/interface/IStudentRepository';
import { ITeacherRepository } from '../../domain/interface/ITeacherRepository';
import { IExcelParser } from '../../domain/interface/IExcelParser';
import { IBulkUploadStudentUseCase } from '../../domain/interface/IBulkUploadStudentUseCase';
import { IBulkUploadTeacherUseCase } from '../../domain/interface/IBulkUploadTeacherUseCase';
import { IBulkUploadController } from '../../domain/interface/IBulkUploadController';
import { Student } from '../../domain/entities/student';
import { Teacher } from '../../domain/entities/teacher';

export class DependencyContainer {
  private static instance: DependencyContainer;
  private dependencies: Map<string, any> = new Map();

  private constructor() {
    // Register dependencies
    this.dependencies.set('IUserRepository', new UserRepository());
    this.dependencies.set('ITokenService', new AuthService());
    this.dependencies.set(
      'ILoginUseCase',
      new LoginUseCase(
        this.dependencies.get('IUserRepository'),
        this.dependencies.get('ITokenService')
      )
    );
    this.dependencies.set(
      'IUpdatePasswordUseCase',
      new UpdatePasswordUseCase(
        this.dependencies.get('IUserRepository'),
        this.dependencies.get('ITokenService')
      )
    );
    this.dependencies.set(
      'IRefreshTokenUseCase',
      new RefreshTokenUseCase(
        this.dependencies.get('ITokenService'),
        this.dependencies.get('IUserRepository')
      )
    );
    this.dependencies.set(
      'ILogoutUseCase',
      new LogoutUseCase(
        this.dependencies.get('ITokenService'),
        this.dependencies.get('IUserRepository')
      )
    );
    this.dependencies.set(
      'IUserController',
      new UserController(
        this.dependencies.get('ILoginUseCase'),
        this.dependencies.get('IUpdatePasswordUseCase'),
        this.dependencies.get('IRefreshTokenUseCase'),
        this.dependencies.get('ILogoutUseCase')
      )
    );


    // Register repositories
    this.dependencies.set('IStudentRepository', new StudentRepository());
    this.dependencies.set('ITeacherRepository', new TeacherRepository());

    // Register parsers
    this.dependencies.set('StudentExcelParser', new StudentExcelParser());
    this.dependencies.set('TeacherExcelParser', new TeacherExcelParser());

    // Register use cases
    this.dependencies.set(
      'IBulkUploadStudentUseCase',
      new BulkUploadStudentUseCase(
        this.dependencies.get('IStudentRepository'),
        this.dependencies.get('StudentExcelParser')
      )
    );
    this.dependencies.set(
      'IBulkUploadTeacherUseCase',
      new BulkUploadTeacherUseCase(
        this.dependencies.get('ITeacherRepository'),
        this.dependencies.get('TeacherExcelParser')
      )
    );

    // Register controllers
    this.dependencies.set(
      'IBulkUploadController',
      new BulkUploadController(
        this.dependencies.get('IBulkUploadStudentUseCase'),
        this.dependencies.get('IBulkUploadTeacherUseCase')
      )
    );
  }

  static getInstance(): DependencyContainer {
    if (!DependencyContainer.instance) {
      DependencyContainer.instance = new DependencyContainer();
    }
    return DependencyContainer.instance;
  }

  getUserController(): IUserController {
    return this.dependencies.get('IUserController');
  }

  getUserRepository(): IUserRepository {
    return this.dependencies.get('IUserRepository');
  }

  getTokenService(): ITokenService {
    return this.dependencies.get('ITokenService');
  }

  getLoginUseCase(): ILoginUseCase {
    return this.dependencies.get('ILoginUseCase');
  }

  getUpdatePasswordUseCase(): IUpdatePasswordUseCase {
    return this.dependencies.get('IUpdatePasswordUseCase');
  }

  getRefreshTokenUseCase(): IRefreshTokenUseCase {
    return this.dependencies.get('IRefreshTokenUseCase');
  }

  getLogoutUseCase(): ILogoutUseCase {
    return this.dependencies.get('ILogoutUseCase');
  }

  getBulkUploadController(): IBulkUploadController {
    return this.dependencies.get('IBulkUploadController');
  }

  getStudentRepository(): IStudentRepository {
    return this.dependencies.get('IStudentRepository');
  }

  getTeacherRepository(): ITeacherRepository {
    return this.dependencies.get('ITeacherRepository');
  }

  getStudentExcelParser(): IExcelParser<Student> {
    return this.dependencies.get('StudentExcelParser');
  }

  getTeacherExcelParser(): IExcelParser<Teacher> {
    return this.dependencies.get('TeacherExcelParser');
  }

  getBulkUploadStudentUseCase(): IBulkUploadStudentUseCase {
    return this.dependencies.get('IBulkUploadStudentUseCase');
  }

  getBulkUploadTeacherUseCase(): IBulkUploadTeacherUseCase {
    return this.dependencies.get('IBulkUploadTeacherUseCase');
  }

  // For testing: Allow overriding dependencies
  register<T>(key: string, instance: T): void {
    this.dependencies.set(key, instance);
  }
}