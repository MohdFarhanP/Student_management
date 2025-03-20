import { ClassEntity } from '../../domain/entities/class.js';
import { ClassModel } from '../database/models/classModel.js';
import { Types } from 'mongoose';

export class ClassRepository {
  async findAllClasses(): Promise<{ grade: string }[]> {
    try {
      const uniqueSections = await ClassModel.distinct('grade');
      return uniqueSections.map((grade: string) => ({ grade }));
    } catch (error) {
      console.error('Error fetching class sections:', error);
      throw new Error('Failed to fetch class sections');
    }
  }

  async findByNameAndSection(name: string, section: string) {
    try {
      return await ClassModel.findOne({ name, section });
    } catch (error) {
      console.error('Error finding class by name and section:', error);
      throw new Error('Failed to retrieve class');
    }
  }

  async create(classData: {
    name: string;
    section: string;
    teachers: Types.ObjectId[];
    timetable: Types.ObjectId;
    students: Types.ObjectId[];
    totalStudents: number;
    tutor: string;
    roomNo: string;
    subjects: Types.ObjectId[];
    grade: string;
  }): Promise<string> {
    try {
      await ClassModel.create(classData);
      return 'Class added successfully';
    } catch (error) {
      console.error('Error creating class:', error);
      throw new Error('Failed to create class');
    }
  }

  async findAll(page: number, limit: number) {
    try {
      const skip = (page - 1) * limit;
      const classes = await ClassModel.find().skip(skip).limit(limit);
      const totalCount = await ClassModel.countDocuments();

      return { classes, totalCount };
    } catch (error) {
      console.error('Error fetching all classes:', error);
      throw new Error('Failed to fetch classes');
    }
  }

  async findById(id: string) {
    try {
      return await ClassModel.findById(id);
    } catch (error) {
      console.error('Error finding class by ID:', error);
      throw new Error('Failed to retrieve class');
    }
  }
  async findByGrade(grade: string) {
    try {
      return await ClassModel.find({ grade });
    } catch (error) {
      console.error('Error finding classes by grade:', error);
      throw new Error('Failed to retrieve classes by grade');
    }
  }
  async update(id: string, classData: Partial<ClassEntity>): Promise<string> {
    try {
      await ClassModel.findByIdAndUpdate(
        id,
        { $set: classData },
        { new: true }
      );
      return 'Class updated successfully';
    } catch (error) {
      console.error('Error updating class:', error);
      throw new Error('Failed to update class');
    }
  }
}
