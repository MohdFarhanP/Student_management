import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import { connectDB } from './infrastructure/database';
import adminRoutes from './modules/admin/routes/adminRoutes'

dotenv.config();

const app = express();
connectDB();
app.use(cors());
app.use(express.json());

app.use('/api/admin',adminRoutes);


export default app;