import mongoose from 'mongoose';
import { IAdminModel } from '../interface/IAdminModel';

export const AdminSchema = new mongoose.Schema<IAdminModel>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
  },
});
