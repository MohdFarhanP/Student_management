import { Server as SocketIOServer } from 'socket.io';
import { Queue, Worker } from 'bullmq';
import { LiveSessionRepository } from '../repositories/LiveSessionRepository';
import { ScheduleLiveSession } from '../../application/useCases/liveSession/ScheduleLiveSessionUseCase';
import { JoinLiveSession } from '../../application/useCases/liveSession/JoinLiveSessionUseCase';
import { setupLiveSessionQueue } from '../jobs/SetupLiveSessionQueue';
import { AgoraVideoService } from '../services/AgoraVideoService';
import { StudentRepository } from '../repositories/admin/studentRepository';
import { TeacherRepository } from '../repositories/admin/teacherRepository';
import { StudentExcelParser } from '../parsers/studentExcelParser';
import { TeacherExcelParser } from '../parsers/teacherExcelParser';
import { BulkUploadStudentUseCase } from '../../application/useCases/admin/student/bulkUploadStudentUseCase';
import { BulkUploadTeacherUseCase } from '../../application/useCases/admin/teacher/bulkUploadTeachersUseCase';
import { BulkUploadController } from '../../interfaces/controllers/admin/bulkUpload/bulkUploadController';
import { IStudentRepository } from '../../domain/repositories/IStudentRepository';
import { ITeacherRepository } from '../../domain/repositories/ITeacherRepository';
import { IExcelParser } from '../../application/services/IExcelParser';
import { IBulkUploadStudentUseCase } from '../../domain/useCase/IBulkUploadStudentUseCase';
import { IBulkUploadTeacherUseCase } from '../../domain/useCase/IBulkUploadTeacherUseCase';
import { IBulkUploadController } from '../../interfaces/controllers/admin/bulkUpload/IBulkUploadController';
import { StudentEntity } from '../../domain/entities/student';
import { TeacherEntity } from '../../domain/entities/teacher';
import { ClassRepository } from '../repositories/admin/classRepository';
import { SubjectRepository } from '../repositories/admin/subjectRepository';
import { CreateClassUseCase } from '../../application/useCases/admin/class/createClassUseCase';
import { FetchClassUseCase } from '../../application/useCases/admin/class/fetchClassUseCase';
import { GetClassesUseCase } from '../../application/useCases/admin/class/getClassesUseCase';
import { UpdateClassUseCase } from '../../application/useCases/admin/class/updateClassUseCase';
import { GetClassNameUseCase } from '../../application/useCases/admin/class/getClassNameUseCase';
import { GetStudentsByClassUseCase } from '../../application/useCases/admin/class/getStudentsByClass';
import { ClassController } from '../../interfaces/controllers/admin/class/classController';
import { CreateSubjectUseCase } from '../../application/useCases/admin/subject/createSubjectUseCase';
import { FetchSubjectsByClassIdUseCase } from '../../application/useCases/admin/subject/fetchSubjectsByClassIdUseCase';
import { GetSubjectsByGradeUseCase } from '../../application/useCases/admin/subject/getSubjectsByGradeUseCase';
import { DeleteSubjectUseCase } from '../../application/useCases/admin/subject/deleteSubjectUseCase';
import { UpdateSubjectUseCase } from '../../application/useCases/admin/subject/updateSubjectUseCase';
import { SubjectController } from '../../interfaces/controllers/admin/subject/subjectController';
import { StudentController } from '../../interfaces/controllers/admin/student/studentController';
import { AddStudentUseCase } from '../../application/useCases/admin/student/addStudentUseCase';
import { DeleteStudentUseCase } from '../../application/useCases/admin/student/deleteStudentUseCase';
import { EditStudentUseCase } from '../../application/useCases/admin/student/editStudentUseCase';
import { GetAllStudentsUseCase } from '../../application/useCases/admin/student/getAllStudentsUseCase';
import { GetStudentProfileUseCase as AdminGetStudentProfileUseCase } from '../../application/useCases/student/GetStudentProfileUseCase';
import { AuthService } from '../services/authService';
import { IClassRepository } from '../../domain/repositories/IClassRepository';
import { ISubjectRepository } from '../../domain/repositories/ISubjectRepository';
import { IClassController } from '../../interfaces/controllers/admin/class/IClassController';
import { ISubjectController } from '../../interfaces/controllers/admin/subject/ISubjectController';
import { IStudentController } from '../../interfaces/controllers/admin/student/IStudentController';
import { ICreateClassUseCase } from '../../domain/useCase/ICreateClassUseCase';
import { IFetchClassUseCase } from '../../domain/useCase/IFetchClassUseCase';
import { IGetClassesUseCase } from '../../domain/useCase/IGetClassesUseCase';
import { IUpdateClassUseCase } from '../../domain/useCase/IUpdateClassUseCase';
import { IGetClassNameUseCase } from '../../domain/useCase/IGetClassNameUseCase';
import { IGetStudentsByClassUseCase } from '../../domain/useCase/IGetStudentsByClassUseCase';
import { ICreateSubjectUseCase } from '../../domain/useCase/ICreateSubjectUseCase';
import { IFetchSubjectsByClassIdUseCase } from '../../domain/useCase/IFetchSubjectsByClassIdUseCase';
import { IGetSubjectsByGradeUseCase } from '../../domain/useCase/IGetSubjectsByGradeUseCase';
import { IDeleteSubjectUseCase } from '../../domain/useCase/IDeleteSubjectUseCase';
import { IUpdateSubjectUseCase } from '../../domain/useCase/IUpdateSubjectUseCase';
import { IAddStudentUseCase } from '../../domain/useCase/IAddStudentUseCase';
import { IDeleteStudentUseCase } from '../../domain/useCase/IDeleteStudentUseCase';
import { IEditStudentUseCase } from '../../domain/useCase/IEditStudentUseCase';
import { IGetAllStudentsUseCase } from '../../domain/useCase/IGetAllStudentsUseCase';
import { IGetStudentProfileUseCase as IAdminGetStudentProfileUseCase } from '../../domain/useCase/IGetStudentProfileUseCase';
import { TeacherController } from '../../interfaces/controllers/admin/teacher/teachersController';
import { AddTeacherUseCase } from '../../application/useCases/admin/teacher/addTeacherUseCase';
import { DeleteTeacherUseCase } from '../../application/useCases/admin/teacher/deleteTeacherUseCase';
import { EditTeacherUseCase } from '../../application/useCases/admin/teacher/editTeacherUseCase';
import { GetAllTeachersUseCase } from '../../application/useCases/admin/teacher/getAllTeachersUseCase';
import { GetTeachersByLimitUseCase } from '../../application/useCases/admin/teacher/getTeachersByLimitUseCase';
import { ITeacherController } from '../../interfaces/controllers/admin/teacher/ITeacherController';
import { IAddTeacherUseCase } from '../../domain/useCase/IAddTeacherUseCase';
import { IDeleteTeacherUseCase } from '../../domain/useCase/IDeleteTeacherUseCase';
import { IEditTeacherUseCase } from '../../domain/useCase/IEditTeacherUseCase';
import { IGetAllTeachersUseCase } from '../../domain/useCase/IGetAllTeachersUseCase';
import { IGetTeachersByLimitUseCase } from '../../domain/useCase/IGetTeachersByLimitUseCase';
import { TimetableController } from '../../interfaces/controllers/admin/timetable/timeTableController';
import { ManageTimetableUseCase } from '../../application/useCases/admin/timeTable/ManageTimetableUseCase';
import { TimetableRepository } from '../repositories/admin/timeTableRepository';
import { ITimetableController } from '../../interfaces/controllers/admin/timetable/ITimetableController';
import { IManageTimetableUseCase } from '../../domain/useCase/IManageTimetableUseCase';
import { ITimetableRepository } from '../../domain/repositories/ITimetableRepository';
import { UpdateTeacherAvailabilityUseCase } from '../../application/useCases/admin/timeTable/updateTeacherAvailabilityUseCase';
import { IUpdateTeacherAvailabilityUseCase } from '../../domain/useCase/IUpdateTeacherAvailabilityUseCase';
import { StudentProfileController } from '../../interfaces/controllers/student/studentProfileController';
import { GetStudentProfileUseCase } from '../../application/useCases/student/GetStudentProfileUseCase';
import { UpdateStudentProfileImageUseCase } from '../../application/useCases/student/UpdateStudentProfileImageUseCase';
import { StudentProfileRepository } from '../repositories/student/StudentProfileRepository';
import { IStudentProfileController } from '../../interfaces/controllers/student/IStudentProfileController';
import { IGetStudentProfileUseCase } from '../../domain/useCase/IGetStudentProfileUseCase';
import { IStudentProfileRepository } from '../../domain/repositories/IStudentProfileRepository';
import { TeacherProfileController } from '../../interfaces/controllers/teacher/teacherProfileController';
import { GetTeacherProfileUseCase } from '../../application/useCases/teacher/getTeacherProfileUseCase';
import { UpdateTeacherProfileUseCase } from '../../application/useCases/teacher/updateTeacherProfileUseCase';
import { TeacherProfileRepository } from '../repositories/teacher/TeacherProfileRepository';
import { ITeacherProfileController } from '../../interfaces/controllers/teacher/ITeacherProfileController';
import { IGetTeacherProfileUseCase } from '../../domain/useCase/IGetTeacherProfileUseCase';
import { IUpdateTeacherProfileUseCase } from '../../domain/useCase/IUpdateTeacherProfileUseCase';
import { ITeacherProfileRepository } from '../../domain/repositories/ITeacherProfileRepository';
import { AttendanceController } from '../../interfaces/controllers/teacher/attendanceControllers';
import { IAttendanceController } from '../../interfaces/controllers/teacher/IAttendanceController';
import { MarkAttendanceUseCase } from '../../application/useCases/teacher/markAttendanceUseCase';
import { ViewAttendanceUseCase } from '../../application/useCases/student/ViewAttendanceUseCase';
import { IMarkAttendanceUseCase } from '../../domain/useCase/IMarkAttendanceUseCase';
import { IViewAttendanceUseCase } from '../../domain/useCase/IViewAttendanceUseCase';
import { AttendanceRepository } from '../repositories/teacher/attendanceRepository';
import { IAttendanceRepository } from '../../domain/repositories/IAttendanceRepository';
import { TimetableService } from '../services/TimetableService';
import { NoteController } from '../../interfaces/controllers/note/noteController';
import { INoteController } from '../../interfaces/controllers/note/INoteController';
import { UploadNoteUseCase } from '../../application/useCases/teacher/UploadNoteUseCase';
import { DownloadNoteUseCase } from '../../application/useCases/student/downloadNotesUseCase';
import { ListNotesUseCase } from '../../application/useCases/student/listNoteUseCase';
import { IUploadNoteUseCase } from '../../domain/useCase/IUploadNoteUseCase';
import { IDownloadNoteUseCase } from '../../domain/useCase/IDownloadNoteUseCase';
import { IListNotesUseCase } from '../../domain/useCase/IListNotesUseCase';
import { NoteRepository } from '../repositories/notesRepository';
import { INoteRepository } from '../../domain/repositories/INotRepository';
import { IUpdateStudentProfileImageUseCase } from '../../domain/useCase/IUpdateStudentProfileImageUseCase';
import { LoginUseCase } from '../../application/useCases/auth/LoginUseCase';
import { LogoutUseCase } from '../../application/useCases/auth/LogoutUseCase';
import { UpdatePasswordUseCase } from '../../application/useCases/auth/UpdatePasswordUseCase';
import { RefreshTokenUseCase } from '../../application/useCases/auth/RefreshTokenUseCase';
import { IUserController } from '../../interfaces/controllers/user/IUserController';
import { UserController } from '../../interfaces/controllers/user/UserController';
import { UserRepository } from '../repositories/userRepository';
import { MessageRepository } from '../repositories/message/messageRepository';
import { SendMessage } from '../../application/useCases/message/sendMessage';
import { ChatController } from '../../interfaces/controllers/chat/chatController';
import { SocketServer } from '../../interfaces/socket/socketServer';
import { IMessageRepository } from '../../domain/repositories/IMessageRepository';
import { ISendMessageUseCase } from '../../domain/useCase/ISendMessageUseCase';
import { IChatController } from '../../interfaces/controllers/chat/IChatController';
import { ISocketServer } from '../../application/services/ISocketServer';
import { NotificationRepository } from '../repositories/notification/notificationRepository';
import { SendNotification } from '../../application/useCases/notification/SendNotificationUseCase';
import { NotificationController } from '../../interfaces/controllers/notification/notificationController';
import { GetNotificationsUseCase } from '../../application/useCases/notification/GetNotificationsUseCase';
import { MarkNotificationAsRead } from '../../application/useCases/notification/MarkNotificationAsReadUseCase';
import { INotificationRepository } from '../../domain/repositories/INotificationRepository';
import { INotificationController } from '../../interfaces/controllers/notification/INotificationController';
import { IGetNotificationsUseCase } from '../../domain/useCase/IGetNotificationsUseCase';
import { IMarkNotificationAsRead } from '../../domain/useCase/IMarkNotificationAsRead';
import { ISendNotificationUseCase } from '../../domain/useCase/ISendNotificationUseCase';
import { IFileValidationService } from '../../application/services/IFileValidationService';
import { FileValidationService } from '../services/FileValidationService';
import { IStorageService } from '../../application/services/IStorageService';
import { S3StorageService } from '../services/S3StorageService';
import { IGeneratePresignedUrlUseCase } from '../../domain/useCase/IGeneratePresignedUrlUseCase';
import { GeneratePresignedUrlUseCase } from '../../application/useCases/GeneratePresignedUrlUseCase';
import { IPresignedUrlController } from '../../interfaces/controllers/presignedUrl/IPresignedUrlController';
import { PresignedUrlController } from '../../interfaces/controllers/presignedUrl/PresignedUrlController';
import { GetClassesForTeacherUseCase } from '../../application/useCases/message/getClassesForTeacher';
import { GetClassForStudentUseCase } from '../../application/useCases/message/getClassForStudent';
import { setupNotificationQueue } from '../workers/notificationWorker';
import { getStudentsIdByClassUseCase } from '../../application/useCases/admin/class/getStudentsIdByClassUseCase';
import { ILeaveRepository } from '../../domain/repositories/ILeaveRepository';
import { LeaveRepository } from '../repositories/LeaveRepository';
import { IApplyForLeaveUseCase } from '../../domain/useCase/IApplyForLeaveUseCase';
import { IViewLeaveHistoryUseCase } from '../../domain/useCase/IViewLeaveHistoryUseCase';
import { IApproveRejectLeaveUseCase } from '../../domain/useCase/IApproveRejectLeaveUseCase';
import { ApplyForLeaveUseCase } from '../../application/useCases/leave/ApplyForLeaveUseCase';
import { ViewLeaveHistoryUseCase } from '../../application/useCases/leave/ViewLeaveHistoryUseCase';
import { ApproveRejectLeaveUseCase } from '../../application/useCases/leave/ApproveRejectLeaveUseCase';
import { FetchTopClassUseCase } from '../../application/useCases/admin/class/fetchTopClassUseCase';
import { FetchWeeklyAttendanceUseCase } from '../../application/useCases/admin/FetchWeeklyAttendanceUseCase';
import { GetAdminDashboardStatsUseCase } from '../../application/useCases/dashboard/GetAdminDashboardStatsUseCase';
import { DashboardRepositoryMongo } from '../repositories/DashboardRepositoryMongo';
import { FetchTeacherClassesUseCase } from '../../application/useCases/admin/teacher/FetchTeacherClassesUseCase';
import { FetchTodayScheduleUseCase } from '../../application/useCases/admin/teacher/FetchTodayScheduleUseCase';
import { FetchLiveSessionsUseCase } from '../../application/useCases/admin/teacher/FetchLiveSessionsUseCase';
import { GetClassesByIdUseCase } from '../../application/useCases/admin/class/GetClassesByIdUseCase';
import { GetStdSessionsUsecase } from '../../application/useCases/student/getStdSessionsUsecase';
import { TrackSessionDurationUseCase } from '../../application/useCases/liveSession/TrackSessionDurationUseCase';
import { MongoSessionDurationRepository } from '../repositories/sessionDurationRepository';
import { GetRecentSessionAttendanceUseCase } from '../../application/useCases/liveSession/GetRecentSessionAttendanceUseCase';
import { MongoStudentFeeDueRepository } from '../repositories/MongoStudentFeeDueRepository';
import { ProcessPaymentUseCase } from '../../application/useCases/fee/ProcessPaymentUseCase';
import { GenerateMonthlyDuesUseCase } from '../../application/useCases/fee/GenerateMonthlyDuesUseCase';
import { MongoRecurringFeeRepository } from '../repositories/MongoRecurringFeeRepository';
import { IRecurringFeeController } from '../../interfaces/controllers/admin/fees/IRecurringFeeController';
import { RecurringFeeController } from '../../interfaces/controllers/admin/fees/RecurringFeeController';
import { RazorpayAdapter } from '../adapters/RazorpayAdapter';
import { PaymentController } from '../../interfaces/controllers/admin/payment/PaymentController';
import { IPaymentController } from '../../interfaces/controllers/admin/payment/IPaymentController';
import { GetStudentInfoUseCase } from '../../application/useCases/student/GetStudentInfoUseCase';
import { MongoPaymentRepository } from '../repositories/MongoPaymentRepository';
import { IGenerateMonthlyDuesUseCase } from '../../domain/useCase/IGenerateMonthlyDuesUseCase';
import { EmailService } from '../services/emailService';
import { SearchStudentsUseCase } from '../../application/useCases/admin/student/searchStudentUseCase';
import { SearchTeachersUseCase } from '../../application/useCases/admin/teacher/searchTeachersUseCase';

export class DependencyContainer {
  private static instance: DependencyContainer;
  private dependencies: Map<string, any> = new Map();

  private constructor(io?: SocketIOServer) {
    // Repositories
    this.dependencies.set('IStudentRepository', new StudentRepository());
    this.dependencies.set('ITeacherRepository', new TeacherRepository());
    this.dependencies.set('IClassRepository', new ClassRepository());
    this.dependencies.set('ISubjectRepository', new SubjectRepository());
    this.dependencies.set('ITimetableRepository', new TimetableRepository());
    this.dependencies.set(
      'IStudentProfileRepository',
      new StudentProfileRepository()
    );
    this.dependencies.set(
      'ITeacherProfileRepository',
      new TeacherProfileRepository()
    );
    this.dependencies.set('IAttendanceRepository', new AttendanceRepository());
    this.dependencies.set('INoteRepository', new NoteRepository());
    this.dependencies.set('IUserRepository', new UserRepository());
    this.dependencies.set('IMessageRepository', new MessageRepository());
    this.dependencies.set(
      'INotificationRepository',
      new NotificationRepository()
    );
    this.dependencies.set(
      'ILiveSessionRepository',
      new LiveSessionRepository()
    );
    this.dependencies.set('ILeaveRepository', new LeaveRepository());
    this.dependencies.set(
      'IDashboardRepository',
      new DashboardRepositoryMongo()
    );
    this.dependencies.set(
      'ISessionDurationRepository',
      new MongoSessionDurationRepository()
    );
    this.dependencies.set(
      'IStudentFeeDueRepository',
      new MongoStudentFeeDueRepository()
    );
    this.dependencies.set('IPaymentRepository', new MongoPaymentRepository());
    this.dependencies.set(
      'IRecurringFeeRepository',
      new MongoRecurringFeeRepository()
    );

    // Services
    this.dependencies.set('IAuthService', new AuthService());
    this.dependencies.set('IEmailService', new EmailService());
    this.dependencies.set('IVideoService', new AgoraVideoService());
    this.dependencies.set(
      'ITimetableService',
      new TimetableService(
        this.dependencies.get('ITimetableRepository') ||
          new TimetableRepository(),
        this.dependencies.get('ITeacherRepository') || new TeacherRepository()
      )
    );
    this.dependencies.set('IStorageService', new S3StorageService());
    this.dependencies.set(
      'IFileValidationService',
      new FileValidationService(this.dependencies.get('INoteRepository'))
    );
    this.dependencies.set('IPaymentGateway', new RazorpayAdapter());

    // Initialize BullMQ Queue for Notifications
    const notificationQueue = new Queue('notifications', {
      connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || '',
      },
    });

    // BullMQ Queue for Live Sessions
    const sessionQueue = new Queue('live-session', {
      connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || '',
      },
    });

    this.dependencies.set('SessionQueue', sessionQueue);
    this.dependencies.set('NotificationQueue', notificationQueue);

    // Use Cases (Live Session)
    this.dependencies.set(
      'IScheduleLiveSessionUseCase',
      new ScheduleLiveSession(
        this.dependencies.get('ILiveSessionRepository'),
        this.dependencies.get('IVideoService'),
        this.dependencies.get('SessionQueue')
      )
    );
    this.dependencies.set(
      'IJoinLiveSessionUseCase',
      new JoinLiveSession(
        this.dependencies.get('ILiveSessionRepository'),
        this.dependencies.get('IVideoService'),
        this.dependencies.get('IStudentRepository'),
        this.dependencies.get('ITeacherRepository')
      )
    );
    this.dependencies.set(
      'ITrackSessionDurationUseCase',
      new TrackSessionDurationUseCase(
        this.dependencies.get('ISessionDurationRepository')
      )
    );
    this.dependencies.set(
      'IGetRecentSessionAttendanceUseCase',
      new GetRecentSessionAttendanceUseCase(
        this.dependencies.get('ILiveSessionRepository'),
        this.dependencies.get('ISessionDurationRepository'),
        this.dependencies.get('IStudentRepository')
      )
    );

    // Use Cases (Notification)
    this.dependencies.set(
      'IGetNotificationsUseCase',
      new GetNotificationsUseCase(
        this.dependencies.get('INotificationRepository')
      )
    );
    this.dependencies.set(
      'IMarkNotificationAsRead',
      new MarkNotificationAsRead(
        this.dependencies.get('INotificationRepository')
      )
    );
    this.dependencies.set(
      'ISendNotificationUseCase',
      new SendNotification(
        this.dependencies.get('INotificationRepository'),
        io,
        notificationQueue
      )
    );

    // Use Cases (Dashboard)
    this.dependencies.set(
      'IGetAdminDashboardStatsUseCase',
      new GetAdminDashboardStatsUseCase(
        this.dependencies.get('IDashboardRepository')
      )
    );

    // Use Cases (Message)
    this.dependencies.set(
      'ISendMessageUseCase',
      new SendMessage(this.dependencies.get('IMessageRepository'))
    );

    // Use Cases (Leave)
    this.dependencies.set(
      'IApplyForLeaveUseCase',
      new ApplyForLeaveUseCase(
        this.dependencies.get('ILeaveRepository'),
        this.dependencies.get('IStudentRepository'),
        this.dependencies.get('ISendNotificationUseCase')
      )
    );
    this.dependencies.set(
      'IViewLeaveHistoryUseCase',
      new ViewLeaveHistoryUseCase(
        this.dependencies.get('ILeaveRepository'),
        this.dependencies.get('IUserRepository')
      )
    );
    this.dependencies.set(
      'IApproveRejectLeaveUseCase',
      new ApproveRejectLeaveUseCase(
        this.dependencies.get('ILeaveRepository'),
        this.dependencies.get('IUserRepository'),
        this.dependencies.get('ISendNotificationUseCase')
      )
    );

    // Socket Server
    this.dependencies.set(
      'ISocketServer',
      new SocketServer(
        io,
        this.dependencies.get('IMessageRepository'),
        this.dependencies.get('ISendMessageUseCase'),
        this.dependencies.get('INotificationRepository'),
        this.dependencies.get('ISendNotificationUseCase'),
        this.dependencies.get('IClassRepository'),
        this.dependencies.get('IScheduleLiveSessionUseCase'),
        this.dependencies.get('IJoinLiveSessionUseCase'),
        this.dependencies.get('ILiveSessionRepository'),
        this.dependencies.get('IVideoService'),
        this.dependencies.get('IApplyForLeaveUseCase'),
        this.dependencies.get('IViewLeaveHistoryUseCase'),
        this.dependencies.get('IApproveRejectLeaveUseCase'),
        this.dependencies.get('IGetAdminDashboardStatsUseCase'),
        this.dependencies.get('ITeacherRepository'),
        this.dependencies.get('IStudentRepository'),
        this.dependencies.get('ITrackSessionDurationUseCase')
      )
    );

    // Setup the notification queue processing and store the worker
    const notificationWorker = setupNotificationQueue(
      io,
      this.dependencies.get('INotificationRepository'),
      notificationQueue
    );
    this.dependencies.set('NotificationWorker', notificationWorker);

    // Setup the live session queue processing
    const sessionWorker = setupLiveSessionQueue(
      io,
      this.dependencies.get('ILiveSessionRepository'),
      this.dependencies.get('IVideoService'),
      this.dependencies.get('SessionQueue')
    );
    this.dependencies.set('SessionWorker', sessionWorker);

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
      'IFetchTopClassUseCase',
      new FetchTopClassUseCase(this.dependencies.get('IClassRepository'))
    );
    this.dependencies.set(
      'IFetchWeeklyAttendanceUseCase',
      new FetchWeeklyAttendanceUseCase(
        this.dependencies.get('IAttendanceRepository')
      )
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
    this.dependencies.set(
      'IGetClassesForTeacherUseCase',
      new GetClassesForTeacherUseCase(this.dependencies.get('IClassRepository'))
    );
    this.dependencies.set(
      'IGetClassForStudentUseCase',
      new GetClassForStudentUseCase(this.dependencies.get('IClassRepository'))
    );
    this.dependencies.set(
      'IGetStudentsIdByClassUseCase',
      new getStudentsIdByClassUseCase(
        this.dependencies.get('IStudentRepository')
      )
    );
    this.dependencies.set(
      'IGetClassesByIdUseCase',
      new GetClassesByIdUseCase(this.dependencies.get('IClassRepository'))
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
        this.dependencies.get('IAuthService'),
        this.dependencies.get('IEmailService')
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
      'IGetStdSessionsUsecase',
      new GetStdSessionsUsecase(this.dependencies.get('IStudentRepository'))
    );
    this.dependencies.set(
      'ISearchStudentsUseCase',
      new SearchStudentsUseCase(this.dependencies.get('IStudentRepository'))
    );
    this.dependencies.set(
      'IAdminGetStudentProfileUseCase',
      new AdminGetStudentProfileUseCase(
        this.dependencies.get('IStudentRepository')
      )
    );

    // Use Cases (Teacher - Admin)
    this.dependencies.set(
      'IAddTeacherUseCase',
      new AddTeacherUseCase(
        this.dependencies.get('ITeacherRepository'),
        this.dependencies.get('IAuthService'),
        this.dependencies.get('IEmailService')
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
      new UpdateTeacherAvailabilityUseCase(
        this.dependencies.get('ITeacherRepository')
      )
    );
    this.dependencies.set(
      'IFetchTeacherClassesUseCase',
      new FetchTeacherClassesUseCase(
        this.dependencies.get('ITeacherRepository')
      )
    );
    this.dependencies.set(
      'IFetchTodayScheduleUseCase',
      new FetchTodayScheduleUseCase(this.dependencies.get('ITeacherRepository'))
    );
    this.dependencies.set(
      'IFetchLiveSessionsUseCase',
      new FetchLiveSessionsUseCase(this.dependencies.get('ITeacherRepository'))
    );
    this.dependencies.set(
      'ISearchTeachersUseCase',
      new SearchTeachersUseCase(this.dependencies.get('ITeacherRepository'))
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
      new GetStudentProfileUseCase(
        this.dependencies.get('IStudentProfileRepository')
      )
    );
    this.dependencies.set(
      'IGetStudentInfoUseCase',
      new GetStudentInfoUseCase(
        this.dependencies.get('IStudentProfileRepository')
      )
    );
    this.dependencies.set(
      'IUpdateStudentProfileImageUseCase',
      new UpdateStudentProfileImageUseCase(
        this.dependencies.get('IStudentProfileRepository'),
        this.dependencies.get('IStorageService')
      )
    );
    this.dependencies.set(
      'IProcessPaymentUseCase',
      new ProcessPaymentUseCase(
        this.dependencies.get('IStudentFeeDueRepository'),
        this.dependencies.get('IPaymentRepository'),
        this.dependencies.get('IPaymentGateway')
      )
    );
    this.dependencies.set(
      'IGenerateMonthlyDuesUseCase',
      new GenerateMonthlyDuesUseCase(
        this.dependencies.get('IRecurringFeeRepository'),
        this.dependencies.get('IStudentRepository'),
        this.dependencies.get('IStudentFeeDueRepository'),
        this.dependencies.get('ISendNotificationUseCase'),
        process.env.ADMIN_ID
      )
    );

    // Use Cases (Teacher - Teacher Module)
    this.dependencies.set(
      'IGetTeacherProfileUseCase',
      new GetTeacherProfileUseCase(
        this.dependencies.get('ITeacherProfileRepository')
      )
    );
    this.dependencies.set(
      'IUpdateTeacherProfileUseCase',
      new UpdateTeacherProfileUseCase(
        this.dependencies.get('ITeacherProfileRepository')
      )
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
      new UploadNoteUseCase(this.dependencies.get('INoteRepository'))
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

    // Use Cases (S3 Pre-signed URL)
    this.dependencies.set(
      'IGeneratePresignedUrlUseCase',
      new GeneratePresignedUrlUseCase(
        this.dependencies.get('IFileValidationService'),
        this.dependencies.get('IStorageService')
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
      'IRecurringFeeController',
      new RecurringFeeController(
        this.dependencies.get('IRecurringFeeRepository')
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
        this.dependencies.get('IGetStudentsByClassUseCase'),
        this.dependencies.get('IGetClassesForTeacherUseCase'),
        this.dependencies.get('IGetClassForStudentUseCase'),
        this.dependencies.get('IGetStudentsIdByClassUseCase'),
        this.dependencies.get('IFetchTopClassUseCase'),
        this.dependencies.get('IFetchWeeklyAttendanceUseCase'),
        this.dependencies.get('IGetClassesByIdUseCase')
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
        this.dependencies.get('IAdminGetStudentProfileUseCase'),
        this.dependencies.get('IGetStdSessionsUsecase'),
        this.dependencies.get('ISearchStudentsUseCase')
      )
    );
    this.dependencies.set(
      'ITeacherController',
      new TeacherController(
        this.dependencies.get('IGetTeachersByLimitUseCase'),
        this.dependencies.get('IEditTeacherUseCase'),
        this.dependencies.get('IGetAllTeachersUseCase'),
        this.dependencies.get('IAddTeacherUseCase'),
        this.dependencies.get('IDeleteTeacherUseCase'),
        this.dependencies.get('IFetchTeacherClassesUseCase'),
        this.dependencies.get('IFetchTodayScheduleUseCase'),
        this.dependencies.get('IFetchLiveSessionsUseCase'),
        this.dependencies.get('ISearchTeachersUseCase')
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
        this.dependencies.get('IUpdateStudentProfileImageUseCase'),
        this.dependencies.get('IStudentFeeDueRepository'),
        this.dependencies.get('IProcessPaymentUseCase'),
        this.dependencies.get('IGetStudentInfoUseCase')
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
        this.dependencies.get('IViewAttendanceUseCase'),
        this.dependencies.get('IGetRecentSessionAttendanceUseCase')
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
      new ChatController(
        this.dependencies.get('ISendMessageUseCase'),
        this.dependencies.get('IClassRepository')
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
    this.dependencies.set(
      'IPresignedUrlController',
      new PresignedUrlController(
        this.dependencies.get('IGeneratePresignedUrlUseCase')
      )
    );
    this.dependencies.set(
      'IPaymentController',
      new PaymentController(this.dependencies.get('IStudentFeeDueRepository'))
    );
  }

  static getInstance(io?: SocketIOServer): DependencyContainer {
    if (!DependencyContainer.instance) {
      if (!io) {
        throw new Error(
          'SocketIOServer instance is required for DependencyContainer initialization'
        );
      }
      DependencyContainer.instance = new DependencyContainer(io);
    }
    return DependencyContainer.instance;
  }

  getSessionQueue(): Queue {
    return this.dependencies.get('SessionQueue');
  }

  getSessionWorker(): Worker {
    return this.dependencies.get('SessionWorker');
  }

  getNotificationQueue(): Queue {
    return this.dependencies.get('NotificationQueue');
  }

  getNotificationWorker(): Worker {
    return this.dependencies.get('NotificationWorker');
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
  getRecurringFeeController(): IRecurringFeeController {
    return this.dependencies.get('IRecurringFeeController');
  }

  getPaymentController(): IPaymentController {
    return this.dependencies.get('IPaymentController');
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

  getLeaveRepository(): ILeaveRepository {
    return this.dependencies.get('ILeaveRepository');
  }

  getStudentExcelParser(): IExcelParser<StudentEntity> {
    return this.dependencies.get('StudentExcelParser');
  }

  getTeacherExcelParser(): IExcelParser<TeacherEntity> {
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

  getGenerateMonthlyDuesUseCase(): IGenerateMonthlyDuesUseCase {
    return this.dependencies.get('IGenerateMonthlyDuesUseCase');
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

  getApplyForLeaveUseCase(): IApplyForLeaveUseCase {
    return this.dependencies.get('IApplyForLeaveUseCase');
  }

  getViewLeaveHistoryUseCase(): IViewLeaveHistoryUseCase {
    return this.dependencies.get('IViewLeaveHistoryUseCase');
  }

  getApproveRejectLeaveUseCase(): IApproveRejectLeaveUseCase {
    return this.dependencies.get('IApproveRejectLeaveUseCase');
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

  async shutdown(): Promise<void> {
    const notificationQueue = this.getNotificationQueue();
    const notificationWorker = this.getNotificationWorker();
    const sessionQueue = this.getSessionQueue();
    const sessionWorker = this.getSessionWorker();

    if (notificationWorker) {
      await notificationWorker.close();
      console.log('Notification Worker closed');
    }
    if (notificationQueue) {
      await notificationQueue.close();
      console.log('Notification Queue closed');
    }
    if (sessionWorker) {
      await sessionWorker.close();
      console.log('Session Worker closed');
    }
    if (sessionQueue) {
      await sessionQueue.close();
      console.log('Session Queue closed');
    }
  }

  // For testing: Allow overriding dependencies
  register<T>(key: string, instance: T): void {
    this.dependencies.set(key, instance);
  }
}
