import { Document, Types } from 'mongoose';

export interface ISubjectModel extends Document {
  subjectName:
    | 'Malayalam'
    | 'Tamil'
    | 'Kannada'
    | 'Urdu'
    | 'English'
    | 'Sanskrit'
    | 'Arabic'
    | 'Hindi'
    | 'Math'
    | 'Physics'
    | 'Chemistry'
    | 'Biology'
    | 'Science'
    | 'History'
    | 'Geography'
    | 'Economics'
    | 'ComputerScience'
    | 'Literature'
    | 'GeneralKnowledge';
  teachers: Types.ObjectId[];
  notes: string[];
}
