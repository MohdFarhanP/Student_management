import mongoose from 'mongoose';
import { AdminSchema } from '../scheema/adminSchema';

export const AdminModel = mongoose.model('Admin', AdminSchema);
