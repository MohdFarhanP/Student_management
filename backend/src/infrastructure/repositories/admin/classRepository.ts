import { Types } from 'mongoose';
import { ClassEntity } from '../../../domain/entities/class';
import { ClassModel } from '../../database/models/classModel';
import { TeacherModel } from '../../database/models/teacherModel';
import { IClassRepository } from '../../../domain/interface/admin/IClassRepository';
import { Grade, Section } from '../../../domain/types/enums';

interface PopulatedClass {
  _id: Types.ObjectId;
  name: string;
  section: string;
  teachers: Types.ObjectId[];
  timetable: Types.ObjectId | null;
  students: Types.ObjectId[];
  totalStudents: number;
  tutor: { _id: Types.ObjectId; name: string } | Types.ObjectId | null;
  roomNo: string;
  subjects: Types.ObjectId[];
  grade: string; 
}

export class ClassRepository implements IClassRepository {
  constructor(
    private classModel = ClassModel,
    private teacherModel = TeacherModel
  ) {}

  async findAllGrades(): Promise<{ grade: string }[]> {
    try {
      const uniqueGrades = await this.classModel.distinct('grade');
      return uniqueGrades.map((grade: string) => ({ grade }));
    } catch (error) {
      throw new Error(`Failed to fetch unique grades: ${(error as Error).message}`);
    }
  }

  async findByNameAndSection(name: string, section: string): Promise<ClassEntity | null> {
    try {
      const classDoc = await this.classModel
        .findOne({ name, section })
        .populate('tutor', 'name')
        .lean();
      if (!classDoc) return null;

      return this.mapToClassEntity(classDoc);
    } catch (error) {
      throw new Error(`Failed to retrieve class by name and section: ${(error as Error).message}`);
    }
  }

  async findByName(name: string): Promise<ClassEntity | null> {
    const classDoc = await ClassModel.findOne({ name, isDeleted: false }).lean();
    if (!classDoc) return null;
    return this.mapToClassEntity(classDoc);
  }

  async create(classData: Partial<ClassEntity>): Promise<ClassEntity> {
    try {
      const newClass = await this.classModel.create({
        ...classData,
        tutor: classData.tutor ? new Types.ObjectId(classData.tutor) : undefined,
      });
      const populatedClass = await this.classModel
        .findById(newClass._id)
        .populate('tutor', 'name')
        .lean();

      if (!populatedClass) throw new Error('Failed to retrieve created class');

      return this.mapToClassEntity(populatedClass);
    } catch (error) {
      throw new Error(`Failed to create class: ${(error as Error).message}`);
    }
  }

  async findAll(page: number, limit: number): Promise<{ data: ClassEntity[]; totalCount: number }> {
    try {
      const skip = (page - 1) * limit;
      const rawClasses = await this.classModel
        .find()
        .skip(skip)
        .limit(limit)
        .populate('tutor', 'name')
        .lean();

      const classes = rawClasses.map((c) => this.mapToClassEntity(c));
      const totalCount = await this.classModel.countDocuments();
      return { data: classes, totalCount };
    } catch (error) {
      throw new Error(`Failed to fetch classes: ${(error as Error).message}`);
    }
  }

  async findById(id: string): Promise<ClassEntity | null> {
    try {
      const classDoc = await this.classModel
        .findById(id)
        .populate('tutor', 'name')
        .lean();

      if (!classDoc) return null;
      return this.mapToClassEntity(classDoc);
    } catch (error) {
      throw new Error(`Failed to retrieve class by ID: ${(error as Error).message}`);
    }
  }

  async findByGrade(grade: string): Promise<ClassEntity[]> {
    try {
      const rawClasses = await this.classModel
        .find({ grade })
        .populate('tutor', 'name')
        .lean();

      return rawClasses.map((c) => this.mapToClassEntity(c));
    } catch (error) {
      throw new Error(`Failed to retrieve classes by grade: ${(error as Error).message}`);
    }
  }

  async update(classId: string, classData: Partial<ClassEntity>): Promise<ClassEntity> {
    try {
      const updatedClass = await this.classModel
        .findByIdAndUpdate(
          classId,
          {
            $set: {
              ...classData,
              tutor: classData.tutor ? new Types.ObjectId(classData.tutor) : undefined,
            },
          },
          { new: true }
        )
        .populate('tutor', 'name')
        .lean();

      if (!updatedClass) throw new Error('Class not found');

      return this.mapToClassEntity(updatedClass);
    } catch (error) {
      throw new Error(`Failed to update class: ${(error as Error).message}`);
    }
  }

  async fetchClass(): Promise<{ _id: string; name: string }[]> {
    try {
      const classes = await this.classModel
        .find({}, { _id: 1, name: 1 })
        .lean()
        .exec();

      return classes.map((cls) => ({
        _id: cls._id.toString(),
        name: cls.name,
      }));
    } catch (error) {
      throw new Error(`Failed to fetch classes: ${(error as Error).message}`);
    }
  }

  private mapToClassEntity(classDoc: PopulatedClass): ClassEntity {
    const section = Object.values(Section).includes(classDoc.section as Section)
      ? (classDoc.section as Section)
      : Section.A; // Fallback to Section.A if invalid
    const grade = Object.values(Grade).includes(classDoc.grade as Grade)
      ? (classDoc.grade as Grade)
      : Grade.Grade1; // Fallback to Grade1 if invalid
    const tutorId = classDoc.tutor
      ? typeof classDoc.tutor === 'object' && '_id' in classDoc.tutor
        ? classDoc.tutor._id
        : new Types.ObjectId(classDoc.tutor)
      : new Types.ObjectId(); // Fallback to new ObjectId

    return ClassEntity.create({
      id: classDoc._id.toString(),
      name: classDoc.name,
      section,
      teachers: classDoc.teachers,
      timetable: classDoc.timetable, // Fixed typo: tutorial -> timetable
      students: classDoc.students,
      totalStudents: classDoc.totalStudents,
      tutor: tutorId,
      roomNo: classDoc.roomNo,
      subjects: classDoc.subjects,
      grade,
    });
  }
}