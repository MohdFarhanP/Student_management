import express from 'express';
import cors from 'cors';
import { Server } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { DependencyContainer } from './infrastructure/di/container';
import { ISocketServer } from './domain/interface/ISocketServer';
import { connectDB } from './infrastructure/database/database';
import cookieParser from 'cookie-parser';
import { AppError, BadRequestError, ConflictError, ForbiddenError, NotFoundError } from './domain/errors';
import HttpStatus from './utils/httpStatus';

import adminRoutes, { setAdminControllers } from './interfaces/routes/admin/adminRoutes';
import authenticationRoutes, { setUserController } from './interfaces/routes/authenticationRoutes';
import studentRoutes, { setStudentControllers } from './interfaces/routes/student/student';
import teacherRoutes, { setTeacherControllers } from './interfaces/routes/teacher/teacherRoutes';
import notificationRoutes, { setNotificationController } from './interfaces/routes/notification/notificationRoutes';
import noteRoutes, { setNoteController } from './interfaces/routes/noteRoutes';
import PresignedUrlRoute, { setPresignedUrlController } from './interfaces/routes/presignedUrl';
import chatRouter, { setChatController } from './interfaces/routes/chatRoutes';

const app = express();
const server = new Server(app);

if (!process.env.FRONTEND_CLINT_URL) {
  console.error('Error: FRONTEND_CLINT_URL environment variable is not set.');
  process.exit(1);
}

const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_CLINT_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

console.log('SocketIOServer created');
// Initialize Dependency Container
const dependencyContainer = DependencyContainer.getInstance(io);

// Connect to MongoDB
connectDB();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_CLINT_URL,
    credentials: true,
  })
);

    setChatController(dependencyContainer.getChatController());
    setAdminControllers({
      classController: dependencyContainer.getClassController(),
      subjectController: dependencyContainer.getSubjectController(),
      bulkUploadController: dependencyContainer.getBulkUploadController(),
      studentController: dependencyContainer.getStudentController(),
      teacherController: dependencyContainer.getTeacherController(),
      timetableController: dependencyContainer.getTimetableController(),
    });
    setUserController(dependencyContainer.getUserController());
    setStudentControllers({
      studentProfileController: dependencyContainer.getStudentProfileController(),
      attendanceController: dependencyContainer.getAttendanceController(),
      classController: dependencyContainer.getClassController(),
    });
    setTeacherControllers({
      teacherProfileController: dependencyContainer.getTeacherProfileController(),
      attendanceController: dependencyContainer.getAttendanceController(),
      classController: dependencyContainer.getClassController(),
    });
    setNotificationController(dependencyContainer.getNotificationController());
    setNoteController(dependencyContainer.getNoteController());
    setPresignedUrlController(dependencyContainer.getPresignedUrlController());

// Routes
app.use('/api/admin/', adminRoutes);
app.use('/api/auth', authenticationRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/chat', chatRouter);
app.use('/api/notifications', notificationRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/generate-presigned-url',PresignedUrlRoute);


// Global Error Handling Middleware
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: error.message });
  } else if (error instanceof BadRequestError) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  } else if (error instanceof NotFoundError) {
    res.status(HttpStatus.NOT_FOUND).json({ error: error.message });
  } else if (error instanceof ConflictError) {
    res.status(HttpStatus.CONFLICT).json({ error: error.message });
  } else if (error instanceof ForbiddenError) {
    res.status(HttpStatus.FORBIDDEN).json({ error: error.message });
  } else {
    console.error(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'An unexpected error occurred' });
  }
});

// Initialize Socket Server with dependencies
const socketServer: ISocketServer = dependencyContainer.getSocketServer();
socketServer.initialize();

export { server };