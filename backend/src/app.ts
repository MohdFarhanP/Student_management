import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './infrastructure/database/database.js';
import adminRoutes from './interfaces/routes/adminRoutes.js';
import cookieParser from 'cookie-parser';
import athenticationRoutes from './interfaces/routes/athenticationRoutes.js';

dotenv.config();

const app = express();
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

app.use('/api/admin', adminRoutes);
app.use('api/auth', athenticationRoutes);
export default app;
