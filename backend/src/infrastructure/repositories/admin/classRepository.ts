import mongoose, { Types } from 'mongoose';
import { ClassEntity } from '../../../domain/entities/class';
import { ClassModel } from '../../database/models/classModel';
import { TeacherModel } from '../../database/models/teacherModel';
import { IClassRepository } from '../../../domain/interface/admin/IClassRepository';
import { IClass, TopClassDto } from '../../../domain/types/interfaces';
import { AttendanceModel } from '../../database/models/attendanceModel';


export class ClassRepository implements IClassRepository {
  constructor(
    private classModel = ClassModel,
    private teacherModel = TeacherModel,
    private attendanceModel = AttendanceModel,
  ) {}

  async findAll(page: number, limit: number): Promise<{ data: ClassEntity[]; totalCount: number }> {
    try {
      const skip = (page - 1) * limit;
      const rawClasses = await this.classModel
        .find()
        .skip(skip)
        .limit(limit)
        .populate('tutor', 'name')
        .select('name grade section roomNo tutor totalStudents _id')
        .lean();

      const classes = rawClasses.map((c) => new ClassEntity(c));
      const totalCount = await this.classModel.countDocuments();
      return { data: classes, totalCount };
    } catch (error) {
      throw new Error(`Failed to fetch classes: ${(error as Error).message}`);
    }
  }

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

      return new ClassEntity(classDoc);
    } catch (error) {
      throw new Error(`Failed to retrieve class by name and section: ${(error as Error).message}`);
    }
  }

  async findByName(name: string): Promise<ClassEntity | null> {
    try {
      const classDoc = await this.classModel.findOne({ name, isDeleted: false }).lean();
      if (!classDoc) return null;
      return new ClassEntity(classDoc);
    } catch (error) {
      throw new Error(`Failed to retrieve class by name: ${(error as Error).message}`);
    }
  }

  async create(classData: Partial<ClassEntity>): Promise<ClassEntity> {
    try {
      if (!classData.tutor) {
        throw new Error('Tutor is required');
      }
      const newClass = await this.classModel.create({
        ...classData,
        tutor: new Types.ObjectId(classData.tutor),
      });

      const chatRoomId = `class-${newClass.grade}-${newClass.section}-${newClass.name}`;
      await this.classModel.updateOne(
        { _id: newClass._id },
        { $set: { chatRoomId } }
      );

      const populatedClass = await this.classModel
        .findById(newClass._id)
        .populate('tutor', 'name')
        .lean();

      if (!populatedClass) throw new Error('Failed to retrieve created class');

      return new ClassEntity(populatedClass);
    } catch (error) {
      throw new Error(`Failed to create class: ${(error as Error).message}`);
    }
  }

  async findById(id: string): Promise<ClassEntity | null> {
    try {
      const classDoc = await this.classModel
        .findById(id)
        .populate('tutor', 'name')
        .lean();

      if (!classDoc) return null;
      return new ClassEntity(classDoc);
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

      return rawClasses.map((c) => new ClassEntity(c));
    } catch (error) {
      throw new Error(`Failed to retrieve classes by grade: ${(error as Error).message}`);
    }
  }

  async update(classId: string, classData: Partial<ClassEntity>): Promise<ClassEntity> {
    try {
      const updateData = {
        ...classData,
        tutor: classData.tutor ? new Types.ObjectId(classData.tutor) : undefined,
      };
      if (updateData.tutor === undefined) {
        delete updateData.tutor; // Do not update tutor if not provided
      }
      const updatedClass = await this.classModel
        .findByIdAndUpdate(
          classId,
          { $set: updateData },
          { new: true }
        )
        .populate('tutor', 'name')
        .lean();

      if (!updatedClass) throw new Error('Class not found');

      return new ClassEntity(updatedClass);
    } catch (error) {
      throw new Error(`Failed to update class: ${(error as Error).message}`);
    }
  }

  async fetchClass(): Promise<{ _id: string; name: string }[]> {
    try {
      const classes = await this.classModel
        .find({}, { _id: 1, name: 1 ,chatRoomId: 1})
        .lean()
        .exec();

      return classes.map((cls) => ({
        _id: cls._id.toString(),
        name: cls.name,
        chatRoomId: cls.chatRoomId,
      }));
    } catch (error) {
      throw new Error(`Failed to fetch classes: ${(error as Error).message}`);
    }
  }

  async isStudentInClass(studentId: string, chatRoomId: string): Promise<boolean> {
    try {
      const classDoc = await ClassModel.findOne({
        chatRoomId,
        students: new mongoose.Types.ObjectId(studentId),
        isDeleted: false,
      });
      return !!classDoc;
    } catch (error) {
      throw new Error(
        'Failed to verify student class membership: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  }

  async isTeacherInClass(teacherId: string, chatRoomId: string): Promise<boolean> {
    try {
      const classDoc = await ClassModel.findOne({
        chatRoomId,
        $or: [
          { teachers: new mongoose.Types.ObjectId(teacherId) },
          { tutor: new mongoose.Types.ObjectId(teacherId) },
        ],
        isDeleted: false,
      });
      return !!classDoc;
    } catch (error) {
      throw new Error(
        'Failed to verify teacher class membership: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  }

  async getClassesForTeacher(teacherId: string): Promise<Partial<IClass>[]> {
    try {
      const classes = await ClassModel.find({
        $or: [
          { teachers: new mongoose.Types.ObjectId(teacherId) },
          { tutor: new mongoose.Types.ObjectId(teacherId) },
        ],
        isDeleted: false,
      }).select('chatRoomId name grade section');
      return classes.map((doc) => ({
        _id: doc._id,
        chatRoomId: doc.chatRoomId,
        name: doc.name,
        section: doc.section,
        grade: doc.grade,
        // Other fields as needed
      }));
    } catch (error) {
      throw new Error(
        'Failed to fetch classes for teacher: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  }

  async getClassForStudent(studentId: string): Promise<Partial<IClass> | null> {
    try {
      const classDoc = await ClassModel.findOne({
        students: new mongoose.Types.ObjectId(studentId),
        isDeleted: false,
      }).select('chatRoomId name grade section');
      if (!classDoc) return null;
      return {
        _id: classDoc._id,
        chatRoomId: classDoc.chatRoomId,
        name: classDoc.name,
        section: classDoc.section,
        grade: classDoc.grade,
        // Other fields as needed
      };
    } catch (error) {
      throw new Error(
        'Failed to fetch class for student: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  }
  async getTopClasses(limit: number): Promise<TopClassDto[]> {
    const classes = await this.attendanceModel.aggregate([
      {
        $group: {
          _id: '$classId',
          present: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } },
          total: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'classes',
          localField: '_id',
          foreignField: '_id',
          as: 'class',
        },
      },
      { $unwind: '$class' },
      {
        $project: {
          className: '$class.name',
          attendancePercentage: { $multiply: [{ $divide: ['$present', '$total'] }, 100] },
        },
      },
      { $sort: { attendancePercentage: -1 } },
      { $limit: limit },
    ]);
    return classes.map((cls) => ({
      className: cls.className,
      attendancePercentage: Math.round(cls.attendancePercentage),
    }));
  }
}