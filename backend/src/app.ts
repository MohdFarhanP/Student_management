import express from 'express';
import cors from 'cors';
import { Server } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import chatRoutes from './interfaces/routes/chatRoutes.js';
import { SocketServer } from './infrastructure/database/socketServer.js';
import { connectDB } from './infrastructure/database/database.js';
import adminRoutes from './interfaces/routes/admin/adminRoutes.js';
import cookieParser from 'cookie-parser';
import authenticationRoutes from './interfaces/routes/authenticationRoutes.js';
import studentRoutes from './interfaces/routes/student/studentRoutes.js';
import teacherRoutes from './interfaces/routes/teacher/teacherRoutes.js';

const app = express();
const server = new Server(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

connectDB();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use('/api/admin/', adminRoutes);
app.use('/api/auth', authenticationRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/chat', chatRoutes);

const socketServer = new SocketServer(io);
socketServer.initialize();

export { app, server };
