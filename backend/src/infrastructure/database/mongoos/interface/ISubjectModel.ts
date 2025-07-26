import { Document, Types } from 'mongoose';

export interface ISubjectModel extends Document {
  subjectName:
    'Malayalam'
      |'Tamil'
      |'Kannada'
      |'Urudu'
      |'English'
      |'Sanskrit'
      |'Arabic'
      |'Hindi'
      |'Mathematics'
      |'Physics'
      |'Chemistry'
      |'Biology'
      |'EnvironmentalScience'
      |'BasicScience'
      |'SocialScience'
      |'PhysicalEducation'
      |'InformationTechnology'
  teachers: Types.ObjectId[];
  notes: string[];
}
