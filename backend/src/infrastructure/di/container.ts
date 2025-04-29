import { StudentRepository } from '../repositories/admin/studentRepository';
import { TeacherRepository } from '../repositories/admin/teacherRepository';
import { StudentExcelParser } from '../parsers/studentExcelParser';
import { TeacherExcelParser } from '../parsers/teacherExcelParser';
import { BulkUploadStudentUseCase } from '../../application/useCases/admin/student/bulkUploadStudentUseCase';
import { BulkUploadTeacherUseCase } from '../../application/useCases/admin/teacher/bulkUploadTeachersUseCase';
import { BulkUploadController } from '../../interfaces/controllers/admin/bulkUploadController';
import { IStudentRepository } from '../../domain/interface/admin/IStudentRepository';
import { ITeacherRepository } from '../../domain/interface/admin/ITeacherRepository';
import { IExcelParser } from '../../domain/interface/admin/IExcelParser';
import { IBulkUploadStudentUseCase } from '../../domain/interface/IBulkUploadStudentUseCase';
import { IBulkUploadTeacherUseCase } from '../../domain/interface/IBulkUploadTeacherUseCase';
import { IBulkUploadController } from '../../domain/interface/IBulkUploadController';
import { Student } from '../../domain/entities/student';
import { Teacher } from '../../domain/entities/teacher';
import { ClassRepository } from '../repositories/admin/classRepository';
import { SubjectRepository } from '../repositories/admin/subjectRepository';
import { CreateClassUseCase } from '../../application/useCases/admin/class/createClassUseCase';
import { FetchClassUseCase } from '../../application/useCases/admin/class/fetchClassUseCase';
import { GetClassesUseCase } from '../../application/useCases/admin/class/getClassesUseCase';
import { UpdateClassUseCase } from '../../application/useCases/admin/class/updateUseCase';
import { GetClassNameUseCase } from '../../application/useCases/admin/class/getClassNames';
import { GetStudentsByClassUseCase } from '../../application/useCases/admin/class/getStudentsByClass';
import { ClassController } from '../../interfaces/controllers/admin/classController';
import { CreateSubjectUseCase } from '../../application/useCases/admin/subject/createSubjectUseCase';
import { FetchSubjectsByClassIdUseCase } from '../../application/useCases/admin/subject/fetchSubjectsByClassIdUseCase';
import { GetSubjectsByGradeUseCase } from '../../application/useCases/admin/subject/getSubjectsByGradeUseCase';
import { DeleteSubjectUseCase } from '../../application/useCases/admin/subject/deleteSubjectUseCase';
import { UpdateSubjectUseCase } from '../../application/useCases/admin/subject/updateSubjectUseCase';
import { SubjectController } from '../../interfaces/controllers/admin/subjectController';
import { StudentController } from '../../interfaces/controllers/admin/studentsController';
import { AddStudentUseCase } from '../../application/useCases/admin/student/addStudentUseCase';
import { DeleteStudentUseCase } from '../../application/useCases/admin/student/deleteStudentUseCase';
import { EditStudentUseCase } from '../../application/useCases/admin/student/editStudentUseCase';
import { GetAllStudentsUseCase } from '../../application/useCases/admin/student/getAllStudentsUseCase';
import { GetStudentProfileUseCase as AdminGetStudentProfileUseCase  } from '../../application/useCases/student/GetStudentProfileUseCase';
import { AuthService } from '../../application/services/AuthService';
import { IClassRepository } from '../../domain/interface/admin/IClassRepository';
import { ISubjectRepository } from '../../domain/interface/ISubjectRepository';
import { IClassController } from '../../domain/interface/IClassController';
import { ISubjectController } from '../../domain/interface/ISubjectController';
import { IStudentController } from '../../domain/interface/IStudentController';
import { ICreateClassUseCase } from '../../domain/interface/ICreateClassUseCase';
import { IFetchClassUseCase } from '../../domain/interface/IFetchClassUseCase';
import { IGetClassesUseCase } from '../../domain/interface/IGetClassesUseCase';
import { IUpdateClassUseCase } from '../../domain/interface/IUpdateClassUseCase';
import { IGetClassNameUseCase } from '../../domain/interface/IGetClassNameUseCase';
import { IGetStudentsByClassUseCase } from '../../domain/interface/IGetStudentsByClassUseCase';
import { ICreateSubjectUseCase } from '../../domain/interface/ICreateSubjectUseCase';
import { IFetchSubjectsByClassIdUseCase } from '../../domain/interface/IFetchSubjectsByClassIdUseCase';
import { IGetSubjectsByGradeUseCase } from '../../domain/interface/IGetSubjectsByGradeUseCase';
import { IDeleteSubjectUseCase } from '../../domain/interface/IDeleteSubjectUseCase';
import { IUpdateSubjectUseCase } from '../../domain/interface/IUpdateSubjectUseCase';
import { IAddStudentUseCase } from '../../domain/interface/IAddStudentUseCase';
import { IDeleteStudentUseCase } from '../../domain/interface/IDeleteStudentUseCase';
import { IEditStudentUseCase } from '../../domain/interface/IEditStudentUseCase';
import { IGetAllStudentsUseCase } from '../../domain/interface/IGetAllStudentsUseCase';
import { IGetStudentProfileUseCase as IAdminGetStudentProfileUseCase } from '../../domain/interface/IGetStudentProfileUseCase';
import { IAuthService } from '../../domain/interface/IAuthService';
import { TeacherController } from '../../interfaces/controllers/admin/teachersController';
import { AddTeacherUseCase } from '../../application/useCases/admin/teacher/addTeacherUseCase';
import { DeleteTeacherUseCase } from '../../application/useCases/admin/teacher/deleteTeacherUseCase';
import { EditTeacherUseCase } from '../../application/useCases/admin/teacher/editTeacherUseCase';
import { GetAllTeachersUseCase } from '../../application/useCases/admin/teacher/getAllTeachersUseCase';
import { GetTeachersByLimitUseCase } from '../../application/useCases/admin/teacher/getTeachersByLimitUseCase';
import { ITeacherController } from '../../domain/interface/ITeacherController';
import { IAddTeacherUseCase } from '../../domain/interface/IAddTeacherUseCase';
import { IDeleteTeacherUseCase } from '../../domain/interface/IDeleteTeacherUseCase';
import { IEditTeacherUseCase } from '../../domain/interface/IEditTeacherUseCase';
import { IGetAllTeachersUseCase } from '../../domain/interface/IGetAllTeachersUseCase';
import { IGetTeachersByLimitUseCase } from '../../domain/interface/IGetTeachersByLimitUseCase';
import { TimetableController } from '../../interfaces/controllers/admin/timeTableController';
import { ManageTimetableUseCase } from '../../application/useCases/admin/timeTable/ManageTimetableUseCase';
import { TimetableRepository } from '../repositories/admin/timeTableRepository';
import { ITimetableController } from '../../domain/interface/ITimetableController';
import { IManageTimetableUseCase } from '../../domain/interface/IManageTimetableUseCase';
import { ITimetableRepository } from '../../domain/interface/admin/ITimetableRepository';
import { UpdateTeacherAvailabilityUseCase } from '../../application/useCases/admin/timeTable/updateTeacherAvailabilityUseCase';
import { IUpdateTeacherAvailabilityUseCase } from '../../domain/interface/IUpdateTeacherAvailabilityUseCase';
import { StudentProfileController } from '../../interfaces/controllers/student/studentProfileController';
import { GetStudentProfileUseCase } from '../../application/useCases/student/GetStudentProfileUseCase';
import { UpdateStudentProfileImageUseCase } from '../../application/useCases/student/UpdateStudentProfileImageUseCase';
import { StudentProfileRepository } from '../repositories/student/StudentProfileRepository';
import { IStudentProfileController } from '../../domain/interface/IStudentProfileController';
import { IGetStudentProfileUseCase } from '../../domain/interface/IGetStudentProfileUseCase';
import { IStudentProfileRepository } from '../../domain/interface/student/IStudentProfileRepository';
import { TeacherProfileController } from '../../interfaces/controllers/teacher/teacherProfileController';
import { GetTeacherProfileUseCase } from '../../application/useCases/teacher/getTeacherProfileUseCase';
import { UpdateTeacherProfileUseCase } from '../../application/useCases/teacher/updateTeacherProfileUseCase';
import { TeacherProfileRepository } from '../repositories/teacher/TeacherProfileRepository';
import { ITeacherProfileController } from '../../domain/interface/ITeacherProfileController';
import { IGetTeacherProfileUseCase } from '../../domain/interface/IGetTeacherProfileUseCase';
import { IUpdateTeacherProfileUseCase } from '../../domain/interface/IUpdateTeacherProfileUseCase';
import { ITeacherProfileRepository } from '../../domain/interface/teacher/ITeacherProfileRepository';
import { AttendanceController } from '../../interfaces/controllers/teacher/attendanceControllers';
import { IAttendanceController } from '../../domain/interface/teacher/IAttendanceController';
import { MarkAttendanceUseCase } from '../../application/useCases/teacher/markAttendanceUseCase';
import { ViewAttendanceUseCase } from '../../application/useCases/student/ViewAttendanceUseCase';
import { IMarkAttendanceUseCase } from '../../domain/interface/IMarkAttendanceUseCase';
import { IViewAttendanceUseCase } from '../../domain/interface/IViewAttendanceUseCase';
import { AttendanceRepository } from '../repositories/teacher/attendanceRepository';
import { IAttendanceRepository } from '../../domain/interface/IAttendanceRepository';
import { TimetableService } from '../services/TimetableService';
import { ITimetableService } from '../../domain/interface/ITimetableService';
import { NoteController } from '../../interfaces/controllers/noteController';
import { INoteController } from '../../domain/interface/INoteController';
import { UploadNoteUseCase } from '../../application/useCases/teacher/UploadNoteUseCase';
import { DownloadNoteUseCase } from '../../application/useCases/student/downloadNotesUseCase';
import { ListNotesUseCase } from '../../application/useCases/student/listNoteUseCase';
import { IUploadNoteUseCase } from '../../domain/interface/IUploadNoteUseCase';
import { IDownloadNoteUseCase } from '../../domain/interface/IDownloadNoteUseCase';
import { IListNotesUseCase } from '../../domain/interface/IListNotesUseCase';
import { NoteRepository } from '../repositories/notesRepository';
import { INoteRepository } from '../../domain/interface/INotRepository';
import { CloudinaryService } from '../services/CloudinaryService';
import { ICloudinaryService } from '../../domain/interface/ICloudinaryService';
import { IUpdateStudentProfileImageUseCase } from '../../domain/interface/IUpdateStudentProfileImageUseCase';
import { LoginUseCase } from '../../application/useCases/auth/LoginUseCase';
import { LogoutUseCase } from '../../application/useCases/auth/LogoutUseCase';
import { UpdatePasswordUseCase } from '../../application/useCases/auth/UpdatePasswordUseCase';
import { RefreshTokenUseCase } from '../../application/useCases/auth/RefreshTokenUseCase';
import { IUserController } from '../../domain/interface/IUserController';
import { UserController } from '../../interfaces/controllers/UserController';
import { UserRepository } from '../repositories/userRepository';
import { MessageRepository } from '../repositories/message/messageRepository';
import { SendMessage } from '../../application/useCases/message/sendMessage';
import { ChatController } from '../../interfaces/controllers/chatController';
import { SocketServer } from '../database/socketServer';
import { Server as SocketIOServer } from 'socket.io';
import { IMessageRepository } from '../../domain/interface/IMessageRepository';
import { ISendMessageUseCase } from '../../domain/interface/ISendMessageUseCase';
import { IChatController } from '../../domain/interface/IChatController';
import { ISocketServer } from '../../domain/interface/ISocketServer';
import { NotificationRepository } from '../repositories/notification/notificationReopository'; // Adjust path as needed
import { SendNotification } from '../../application/useCases/notification/SendNotificationUseCase';
import { NotificationScheduler } from '../services/notificationScheduler';
import { INotificationScheduler } from '../../domain/interface/INotificationScheduler';
import { NotificationController } from '../../interfaces/controllers/notification/notificationController';
import { GetNotificationsUseCase } from '../../application/useCases/notification/GetNotificationsUseCase';
import { MarkNotificationAsRead } from '../../application/useCases/notification/MarkNotificationAsReadUseCase';
import { INotificationRepository } from '../../domain/interface/INotificationRepository';
import { INotificationController } from '../../domain/interface/INotificationController';
import { IGetNotificationsUseCase } from '../../domain/interface/IGetNotificationsUseCase';
import { IMarkNotificationAsRead } from '../../domain/interface/IMarkNotificationAsRead';
import { ISendNotificationUseCase } from '../../domain/interface/ISendNotificationUseCase';
import { IFileValidationService } from '../../domain/interface/IFileValidationService';
import { FileValidationService } from '../../application/services/FileValidationService';
import { IStorageService } from '../../domain/interface/IStorageService';
import { S3StorageService } from '../services/S3StorageService';
import { IGeneratePresignedUrlUseCase } from '../../domain/interface/IGeneratePresignedUrlUseCase';
import { GeneratePresignedUrlUseCase } from '../../application/useCases/GeneratePresignedUrlUseCase';
import { IPresignedUrlController } from '../../domain/interface/IPresignedUrlController';
import { PresignedUrlController } from '../../interfaces/controllers/PresignedUrlController';

export class DependencyContainer {
  private static instance: DependencyContainer;
  private dependencies: Map<string, any> = new Map();

  private constructor(io?: SocketIOServer) {
    // Services
    this.dependencies.set('IAuthService', new AuthService());
    this.dependencies.set(
      'ITimetableService',
      new TimetableService(
        this.dependencies.get('ITimetableRepository') || new TimetableRepository(),
        this.dependencies.get('ITeacherRepository') || new TeacherRepository()
      )
    );
    this.dependencies.set('IStorageService', new S3StorageService()); 
    this.dependencies.set('IFileValidationService', new FileValidationService());

    // Repositories
    this.dependencies.set('IStudentRepository', new StudentRepository());
    this.dependencies.set('ITeacherRepository', new TeacherRepository());
    this.dependencies.set('IClassRepository', new ClassRepository());
    this.dependencies.set('ISubjectRepository', new SubjectRepository());
    this.dependencies.set('ITimetableRepository', new TimetableRepository());
    this.dependencies.set('IStudentProfileRepository', new StudentProfileRepository());
    this.dependencies.set('ITeacherProfileRepository', new TeacherProfileRepository());
    this.dependencies.set('IAttendanceRepository', new AttendanceRepository());
    this.dependencies.set('INoteRepository', new NoteRepository());
    this.dependencies.set('IUserRepository', new UserRepository());
    this.dependencies.set('IMessageRepository', new MessageRepository());
    this.dependencies.set('INotificationRepository', new NotificationRepository());
    this.dependencies.set('INotificationRepository', new NotificationRepository());

    // Parsers
    this.dependencies.set('StudentExcelParser', new StudentExcelParser());
    this.dependencies.set('TeacherExcelParser', new TeacherExcelParser());

    // Use Cases (Bulk Upload)
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

    // Use Cases (Notification)
    this.dependencies.set(
      'IGetNotificationsUseCase',
      new GetNotificationsUseCase(this.dependencies.get('INotificationRepository'))
    );
    this.dependencies.set(
      'IMarkNotificationAsRead',
      new MarkNotificationAsRead(this.dependencies.get('INotificationRepository'))
    );
    this.dependencies.set(
      'ISendNotificationUseCase',
      new SendNotification(this.dependencies.get('INotificationRepository'))
    );

    // Use Cases (Class)
    this.dependencies.set(
      'ICreateClassUseCase',
      new CreateClassUseCase(this.dependencies.get('IClassRepository'))
    );
    this.dependencies.set(
      'IFetchClassUseCase',
      new FetchClassUseCase(this.dependencies.get('IClassRepository'))
    );
    this.dependencies.set(
      'IGetClassesUseCase',
      new GetClassesUseCase(this.dependencies.get('IClassRepository'))
    );
    this.dependencies.set(
      'IUpdateClassUseCase',
      new UpdateClassUseCase(this.dependencies.get('IClassRepository'))
    );
    this.dependencies.set(
      'IGetClassNameUseCase',
      new GetClassNameUseCase(this.dependencies.get('IClassRepository'))
    );
    this.dependencies.set(
      'IGetStudentsByClassUseCase',
      new GetStudentsByClassUseCase(this.dependencies.get('IStudentRepository'))
    );

    // Use Cases (Subject)
    this.dependencies.set(
      'ICreateSubjectUseCase',
      new CreateSubjectUseCase(
        this.dependencies.get('ISubjectRepository'),
        this.dependencies.get('IClassRepository')
      )
    );
    this.dependencies.set(
      'IFetchSubjectsByClassIdUseCase',
      new FetchSubjectsByClassIdUseCase(
        this.dependencies.get('ISubjectRepository'),
        this.dependencies.get('IClassRepository')
      )
    );
    this.dependencies.set(
      'IGetSubjectsByGradeUseCase',
      new GetSubjectsByGradeUseCase(
        this.dependencies.get('ISubjectRepository'),
        this.dependencies.get('IClassRepository')
      )
    );
    this.dependencies.set(
      'IDeleteSubjectUseCase',
      new DeleteSubjectUseCase(
        this.dependencies.get('ISubjectRepository'),
        this.dependencies.get('IClassRepository')
      )
    );
    this.dependencies.set(
      'IUpdateSubjectUseCase',
      new UpdateSubjectUseCase(
        this.dependencies.get('ISubjectRepository'),
        this.dependencies.get('IClassRepository')
      )
    );

    // Use Cases (Student - Admin)
    this.dependencies.set(
      'IAddStudentUseCase',
      new AddStudentUseCase(
        this.dependencies.get('IStudentRepository'),
        this.dependencies.get('IAuthService')
      )
    );
    this.dependencies.set(
      'IDeleteStudentUseCase',
      new DeleteStudentUseCase(this.dependencies.get('IStudentRepository'))
    );
    this.dependencies.set(
      'IEditStudentUseCase',
      new EditStudentUseCase(this.dependencies.get('IStudentRepository'))
    );
    this.dependencies.set(
      'IGetAllStudentsUseCase',
      new GetAllStudentsUseCase(this.dependencies.get('IStudentRepository'))
    );
    this.dependencies.set(
      'IAdminGetStudentProfileUseCase',
      new AdminGetStudentProfileUseCase(this.dependencies.get('IStudentRepository'))
    );

    // Use Cases (Teacher - Admin)
    this.dependencies.set(
      'IAddTeacherUseCase',
      new AddTeacherUseCase(
        this.dependencies.get('ITeacherRepository'),
        this.dependencies.get('IAuthService')
      )
    );
    this.dependencies.set(
      'IDeleteTeacherUseCase',
      new DeleteTeacherUseCase(this.dependencies.get('ITeacherRepository'))
    );
    this.dependencies.set(
      'IEditTeacherUseCase',
      new EditTeacherUseCase(
        this.dependencies.get('ITeacherRepository'),
        this.dependencies.get('IClassRepository'),
        this.dependencies.get('ISubjectRepository')
      )
    );
    this.dependencies.set(
      'IGetAllTeachersUseCase',
      new GetAllTeachersUseCase(this.dependencies.get('ITeacherRepository'))
    );
    this.dependencies.set(
      'IGetTeachersByLimitUseCase',
      new GetTeachersByLimitUseCase(this.dependencies.get('ITeacherRepository'))
    );
    this.dependencies.set(
      'IUpdateTeacherAvailabilityUseCase',
      new UpdateTeacherAvailabilityUseCase(this.dependencies.get('ITeacherRepository'))
    );

    // Use Cases (Timetable)
    this.dependencies.set(
      'IManageTimetableUseCase',
      new ManageTimetableUseCase(
        this.dependencies.get('ITimetableRepository'),
        this.dependencies.get('ITeacherRepository'),
        this.dependencies.get('IUpdateTeacherAvailabilityUseCase')
      )
    );

    // Use Cases (Student - Student Module)
    this.dependencies.set(
      'IGetStudentProfileUseCase',
      new GetStudentProfileUseCase(this.dependencies.get('IStudentProfileRepository'))
    );
    this.dependencies.set(
      'IUpdateStudentProfileImageUseCase',
      new UpdateStudentProfileImageUseCase(
        this.dependencies.get('IStudentProfileRepository'),
        this.dependencies.get('IStorageService') 
      )
    );

    // Use Cases (Teacher - Teacher Module)
    this.dependencies.set(
      'IGetTeacherProfileUseCase',
      new GetTeacherProfileUseCase(this.dependencies.get('ITeacherProfileRepository'))
    );
    this.dependencies.set(
      'IUpdateTeacherProfileUseCase',
      new UpdateTeacherProfileUseCase(this.dependencies.get('ITeacherProfileRepository'))
    );
    this.dependencies.set(
      'IMarkAttendanceUseCase',
      new MarkAttendanceUseCase(
        this.dependencies.get('IAttendanceRepository'),
        this.dependencies.get('ITimetableService')
      )
    );
    this.dependencies.set(
      'IViewAttendanceUseCase',
      new ViewAttendanceUseCase(this.dependencies.get('IAttendanceRepository'))
    );

    // Use Cases (Notes)
    this.dependencies.set(
      'IUploadNoteUseCase',
      new UploadNoteUseCase(
        this.dependencies.get('INoteRepository'),
      )
    );
    this.dependencies.set(
      'IDownloadNoteUseCase',
      new DownloadNoteUseCase(this.dependencies.get('INoteRepository'))
    );
    this.dependencies.set(
      'IListNotesUseCase',
      new ListNotesUseCase(this.dependencies.get('INoteRepository'))
    );

    // Use Cases (Auth)
    this.dependencies.set(
      'ILoginUseCase',
      new LoginUseCase(
        this.dependencies.get('IUserRepository'),
        this.dependencies.get('IAuthService')
      )
    );
    this.dependencies.set(
      'ILogoutUseCase',
      new LogoutUseCase(
        this.dependencies.get('IAuthService'),
        this.dependencies.get('IUserRepository')
      )
    );
    this.dependencies.set(
      'IUpdatePasswordUseCase',
      new UpdatePasswordUseCase(
        this.dependencies.get('IUserRepository'),
        this.dependencies.get('IAuthService')
      )
    );
    this.dependencies.set(
      'IRefreshTokenUseCase',
      new RefreshTokenUseCase(
        this.dependencies.get('IAuthService'),
        this.dependencies.get('IUserRepository')
      )
    );

    // Controllers
    this.dependencies.set(
      'INotificationController',
      new NotificationController(
        this.dependencies.get('INotificationRepository'),
        this.dependencies.get('IMarkNotificationAsRead'),
        this.dependencies.get('IGetNotificationsUseCase')
      )
    );
    this.dependencies.set(
      'IBulkUploadController',
      new BulkUploadController(
        this.dependencies.get('IBulkUploadStudentUseCase'),
        this.dependencies.get('IBulkUploadTeacherUseCase')
      )
    );
    this.dependencies.set(
      'IClassController',
      new ClassController(
        this.dependencies.get('ICreateClassUseCase'),
        this.dependencies.get('IFetchClassUseCase'),
        this.dependencies.get('IGetClassesUseCase'),
        this.dependencies.get('IUpdateClassUseCase'),
        this.dependencies.get('IGetClassNameUseCase'),
        this.dependencies.get('IGetStudentsByClassUseCase')
      )
    );
    this.dependencies.set(
      'ISubjectController',
      new SubjectController(
        this.dependencies.get('ICreateSubjectUseCase'),
        this.dependencies.get('IFetchSubjectsByClassIdUseCase'),
        this.dependencies.get('IGetSubjectsByGradeUseCase'),
        this.dependencies.get('IDeleteSubjectUseCase'),
        this.dependencies.get('IUpdateSubjectUseCase')
      )
    );
    this.dependencies.set(
      'IStudentController',
      new StudentController(
        this.dependencies.get('IGetAllStudentsUseCase'),
        this.dependencies.get('IAddStudentUseCase'),
        this.dependencies.get('IEditStudentUseCase'),
        this.dependencies.get('IDeleteStudentUseCase'),
        this.dependencies.get('IAdminGetStudentProfileUseCase')
      )
    );
    this.dependencies.set(
      'ITeacherController',
      new TeacherController(
        this.dependencies.get('IGetTeachersByLimitUseCase'),
        this.dependencies.get('IEditTeacherUseCase'),
        this.dependencies.get('IGetAllTeachersUseCase'),
        this.dependencies.get('IAddTeacherUseCase'),
        this.dependencies.get('IDeleteTeacherUseCase')
      )
    );
    this.dependencies.set(
      'ITimetableController',
      new TimetableController(this.dependencies.get('IManageTimetableUseCase'))
    );
    this.dependencies.set(
      'IStudentProfileController',
      new StudentProfileController(
        this.dependencies.get('IGetStudentProfileUseCase'),
        this.dependencies.get('IUpdateStudentProfileImageUseCase')
      )
    );
    this.dependencies.set(
      'ITeacherProfileController',
      new TeacherProfileController(
        this.dependencies.get('IGetTeacherProfileUseCase'),
        this.dependencies.get('IUpdateTeacherProfileUseCase')
      )
    );
    this.dependencies.set(
      'IAttendanceController',
      new AttendanceController(
        this.dependencies.get('IMarkAttendanceUseCase'),
        this.dependencies.get('IViewAttendanceUseCase')
      )
    );
    this.dependencies.set(
      'INoteController',
      new NoteController(
        this.dependencies.get('IUploadNoteUseCase'),
        this.dependencies.get('IDownloadNoteUseCase'),
        this.dependencies.get('IListNotesUseCase'),
        this.dependencies.get('IStorageService')
      )
    );
    this.dependencies.set(
      'IChatController',
      new ChatController(this.dependencies.get('ISendMessageUseCase'))
    );
    this.dependencies.set(
      'IUserController',
      new UserController(
        this.dependencies.get('ILoginUseCase'),
        this.dependencies.get('ILogoutUseCase'),
        this.dependencies.get('IUpdatePasswordUseCase'),
        this.dependencies.get('IRefreshTokenUseCase')
      )
    );

    // Services
    this.dependencies.set(
      'INotificationScheduler',
      new NotificationScheduler(
        io || new SocketIOServer(), 
        this.dependencies.get('INotificationRepository')
      )
    );

    this.dependencies.set(
      'ISocketServer',
      new SocketServer(
        io || new SocketIOServer(),
        this.dependencies.get('IMessageRepository'),
        this.dependencies.get('ISendMessageUseCase'),
        this.dependencies.get('INotificationRepository'),
        this.dependencies.get('ISendNotificationUseCase'),
        this.dependencies.get('INotificationScheduler')
      )
    );
  }

  static getInstance(io?: SocketIOServer): DependencyContainer {
    if (!DependencyContainer.instance) {
      DependencyContainer.instance = new DependencyContainer(io);
    }
    return DependencyContainer.instance;
  }

  getPresignedUrlController(): IPresignedUrlController {
    return this.dependencies.get('IPresignedUrlController');
  }

  getFileValidationService(): IFileValidationService {
    return this.dependencies.get('IFileValidationService');
  }

  getStorageService(): IStorageService {
    return this.dependencies.get('IStorageService');
  }

  getGeneratePresignedUrlUseCase(): IGeneratePresignedUrlUseCase {
    return this.dependencies.get('IGeneratePresignedUrlUseCase');
  }

  getNotificationController(): INotificationController {
    return this.dependencies.get('INotificationController');
  }

  getGetNotificationsUseCase(): IGetNotificationsUseCase {
    return this.dependencies.get('IGetNotificationsUseCase');
  }

  getNotificationRepository(): INotificationRepository {
    return this.dependencies.get('INotificationRepository');
  }

  getSendNotificationUseCase(): ISendNotificationUseCase {
    return this.dependencies.get('ISendNotificationUseCase');
  }

  getMarkNotificationAsRead(): IMarkNotificationAsRead {
    return this.dependencies.get('IMarkNotificationAsRead');
  }

  getBulkUploadController(): IBulkUploadController {
    return this.dependencies.get('IBulkUploadController');
  }

  getClassController(): IClassController {
    return this.dependencies.get('IClassController');
  }

  getSubjectController(): ISubjectController {
    return this.dependencies.get('ISubjectController');
  }

  getStudentController(): IStudentController {
    return this.dependencies.get('IStudentController');
  }

  getTeacherController(): ITeacherController {
    return this.dependencies.get('ITeacherController');
  }

  getTimetableController(): ITimetableController {
    return this.dependencies.get('ITimetableController');
  }

  getStudentProfileController(): IStudentProfileController {
    return this.dependencies.get('IStudentProfileController');
  }

  getTeacherProfileController(): ITeacherProfileController {
    return this.dependencies.get('ITeacherProfileController');
  }

  getAttendanceController(): IAttendanceController {
    return this.dependencies.get('IAttendanceController');
  }

  getNoteController(): INoteController {
    return this.dependencies.get('INoteController');
  }

  getUserController(): IUserController {
    return this.dependencies.get('IUserController');
  }

  getStudentRepository(): IStudentRepository {
    return this.dependencies.get('IStudentRepository');
  }

  getTeacherRepository(): ITeacherRepository {
    return this.dependencies.get('ITeacherRepository');
  }

  getClassRepository(): IClassRepository {
    return this.dependencies.get('IClassRepository');
  }

  getSubjectRepository(): ISubjectRepository {
    return this.dependencies.get('ISubjectRepository');
  }

  getTimetableRepository(): ITimetableRepository {
    return this.dependencies.get('ITimetableRepository');
  }

  getStudentProfileRepository(): IStudentProfileRepository {
    return this.dependencies.get('IStudentProfileRepository');
  }

  getTeacherProfileRepository(): ITeacherProfileRepository {
    return this.dependencies.get('ITeacherProfileRepository');
  }

  getAttendanceRepository(): IAttendanceRepository {
    return this.dependencies.get('IAttendanceRepository');
  }

  getNoteRepository(): INoteRepository {
    return this.dependencies.get('INoteRepository');
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

  getCreateClassUseCase(): ICreateClassUseCase {
    return this.dependencies.get('ICreateClassUseCase');
  }

  getFetchClassUseCase(): IFetchClassUseCase {
    return this.dependencies.get('IFetchClassUseCase');
  }

  getGetClassesUseCase(): IGetClassesUseCase {
    return this.dependencies.get('IGetClassesUseCase');
  }

  getUpdateClassUseCase(): IUpdateClassUseCase {
    return this.dependencies.get('IUpdateClassUseCase');
  }

  getGetClassNameUseCase(): IGetClassNameUseCase {
    return this.dependencies.get('IGetClassNameUseCase');
  }

  getGetStudentsByClassUseCase(): IGetStudentsByClassUseCase {
    return this.dependencies.get('IGetStudentsByClassUseCase');
  }

  getCreateSubjectUseCase(): ICreateSubjectUseCase {
    return this.dependencies.get('ICreateSubjectUseCase');
  }

  getFetchSubjectsByClassIdUseCase(): IFetchSubjectsByClassIdUseCase {
    return this.dependencies.get('IFetchSubjectsByClassIdUseCase');
  }

  getGetSubjectsByGradeUseCase(): IGetSubjectsByGradeUseCase {
    return this.dependencies.get('IGetSubjectsByGradeUseCase');
  }

  getDeleteSubjectUseCase(): IDeleteSubjectUseCase {
    return this.dependencies.get('IDeleteSubjectUseCase');
  }

  getUpdateSubjectUseCase(): IUpdateSubjectUseCase {
    return this.dependencies.get('IUpdateSubjectUseCase');
  }

  getAddStudentUseCase(): IAddStudentUseCase {
    return this.dependencies.get('IAddStudentUseCase');
  }

  getDeleteStudentUseCase(): IDeleteStudentUseCase {
    return this.dependencies.get('IDeleteStudentUseCase');
  }

  getEditStudentUseCase(): IEditStudentUseCase {
    return this.dependencies.get('IEditStudentUseCase');
  }

  getGetAllStudentsUseCase(): IGetAllStudentsUseCase {
    return this.dependencies.get('IGetAllStudentsUseCase');
  }

  getAdminGetStudentProfileUseCase(): IAdminGetStudentProfileUseCase {
    return this.dependencies.get('IAdminGetStudentProfileUseCase');
  }

  getAddTeacherUseCase(): IAddTeacherUseCase {
    return this.dependencies.get('IAddTeacherUseCase');
  }

  getDeleteTeacherUseCase(): IDeleteTeacherUseCase {
    return this.dependencies.get('IDeleteTeacherUseCase');
  }

  getEditTeacherUseCase(): IEditTeacherUseCase {
    return this.dependencies.get('IEditTeacherUseCase');
  }

  getGetAllTeachersUseCase(): IGetAllTeachersUseCase {
    return this.dependencies.get('IGetAllTeachersUseCase');
  }

  getGetTeachersByLimitUseCase(): IGetTeachersByLimitUseCase {
    return this.dependencies.get('IGetTeachersByLimitUseCase');
  }

  getUpdateTeacherAvailabilityUseCase(): IUpdateTeacherAvailabilityUseCase {
    return this.dependencies.get('IUpdateTeacherAvailabilityUseCase');
  }

  getManageTimetableUseCase(): IManageTimetableUseCase {
    return this.dependencies.get('IManageTimetableUseCase');
  }

  getGetStudentProfileUseCase(): IGetStudentProfileUseCase {
    return this.dependencies.get('IGetStudentProfileUseCase');
  }

  getUpdateStudentProfileImageUseCase(): IUpdateStudentProfileImageUseCase {
    return this.dependencies.get('IUpdateStudentProfileImageUseCase');
  }

  getGetTeacherProfileUseCase(): IGetTeacherProfileUseCase {
    return this.dependencies.get('IGetTeacherProfileUseCase');
  }

  getUpdateTeacherProfileUseCase(): IUpdateTeacherProfileUseCase {
    return this.dependencies.get('IUpdateTeacherProfileUseCase');
  }

  getMarkAttendanceUseCase(): IMarkAttendanceUseCase {
    return this.dependencies.get('IMarkAttendanceUseCase');
  }

  getViewAttendanceUseCase(): IViewAttendanceUseCase {
    return this.dependencies.get('IViewAttendanceUseCase');
  }

  getUploadNoteUseCase(): IUploadNoteUseCase {
    return this.dependencies.get('IUploadNoteUseCase');
  }

  getDownloadNoteUseCase(): IDownloadNoteUseCase {
    return this.dependencies.get('IDownloadNoteUseCase');
  }

  getListNotesUseCase(): IListNotesUseCase {
    return this.dependencies.get('IListNotesUseCase');
  }

  getChatController(): IChatController {
    return this.dependencies.get('IChatController');
  }

  getSocketServer(): ISocketServer {
    return this.dependencies.get('ISocketServer');
  }

  getMessageRepository(): IMessageRepository {
    return this.dependencies.get('IMessageRepository');
  }

  getSendMessageUseCase(): ISendMessageUseCase {
    return this.dependencies.get('ISendMessageUseCase');
  }

  getNotificationScheduler(): INotificationScheduler {
    return this.dependencies.get('INotificationScheduler');
  }

  // For testing: Allow overriding dependencies
  register<T>(key: string, instance: T): void {
    this.dependencies.set(key, instance);
  }
}
