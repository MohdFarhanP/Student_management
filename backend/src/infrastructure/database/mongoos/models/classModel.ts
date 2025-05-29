import mongoose from 'mongoose';
import { ClassSchema } from '../scheema/classSchema';

export const ClassModel = mongoose.model('Class', ClassSchema);
