import express from 'express';
import cors from 'cors';
import { Server } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { DependencyContainer } from './infrastructure/di/container';
import chatRouter from './interfaces/routes/chatRoutes';
import { ISocketServer } from './domain/interface/ISocketServer';
import { connectDB } from './infrastructure/database/database';
import adminRoutes from './interfaces/routes/admin/adminRoutes';
import cookieParser from 'cookie-parser';
import authenticationRoutes from './interfaces/routes/authenticationRoutes';
import studentRoutes from './interfaces/routes/student/student';
import teacherRoutes from './interfaces/routes/teacher/teacherRoutes';
import notificationRoutes from './interfaces/routes/notification/notificationRoutes';
import noteRoutes from './interfaces/routes/noteRoutes';
import { AppError, BadRequestError, ConflictError, ForbiddenError, NotFoundError } from './domain/errors';
import HttpStatus from './utils/httpStatus';

const app = express();
const server = new Server(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

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
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

// Routes
app.use('/api/admin/', adminRoutes);
app.use('/api/auth', authenticationRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/chat', chatRouter);
app.use('/api/notifications', notificationRoutes);
app.use('/api/notes', noteRoutes);


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