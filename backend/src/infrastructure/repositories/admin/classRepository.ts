import mongoose, { Types } from 'mongoose';
import { ClassEntity } from '../../../domain/entities/class';
import { ClassModel } from '../../database/mongoos/models/classModel';
import { TeacherModel } from '../../database/mongoos/models/teacherModel';
import { IClassRepository } from '../../../domain/repositories/IClassRepository';
import { IClass } from '../../../domain/types/interfaces';
import { AttendanceModel } from '../../database/mongoos/models/attendanceModel';
import { IClassData, TopClassDto } from '../../../application/dtos/classDtos';
import { Grade, Section } from '../../../domain/types/enums';
import {
  mapGrade,
  mapSection,
} from '../../database/mongoos/helpers/enumMappers';

export class ClassRepository implements IClassRepository {
  constructor(
    private classModel = ClassModel,
    private teacherModel = TeacherModel,
    private attendanceModel = AttendanceModel
  ) {}

  async findByUserId(userId: string): Promise<IClassData | null> {
    try {
      const classDetails = await this.classModel
        .findOne({ students: new Types.ObjectId(userId), isDeleted: false })
        .populate('tutor', 'name email')
        .populate('timetable')
        .select('name grade section roomNo tutor totalStudents chatRoomId')
        .lean();

      if (!classDetails) return null;

      return {
        id: classDetails._id.toString(),
        name: classDetails.name,
        grade: classDetails.grade,
        section: classDetails.section,
        roomNo: classDetails.roomNo,
        tutor: classDetails.tutor ? (classDetails.tutor as any).name : '',
        totalStudents: classDetails.totalStudents,
        chatRoomId: classDetails.chatRoomId,
      };
    } catch (error) {
      throw new Error(
        `Failed to fetch class details: ${(error as Error).message}`
      );
    }
  }

  async findAll(
    page: number,
    limit: number
  ): Promise<{ data: ClassEntity[]; totalCount: number }> {
    try {
      const skip = (page - 1) * limit;
      const rawClasses = await this.classModel
        .find({ isDeleted: false })
        .skip(skip)
        .limit(limit)
        .populate('tutor', 'name _id')
        .select(
          'name grade section roomNo tutor totalStudents teachers students subjects timetable chatRoomId isDeleted _id'
        )
        .lean();

      const classes = rawClasses.map(
        (c) =>
          new ClassEntity({
            id: c._id.toString(),
            name: c.name,
            section: c.section as Section,
            teachers: c.teachers?.map((id) => id.toString()) || [],
            timetable: c.timetable ? c.timetable.toString() : null,
            students: c.students?.map((id) => id.toString()) || [],
            totalStudents: c.totalStudents || 0,
            tutor: c.tutor ? (c.tutor as any)._id.toString() : '',
            roomNo: c.roomNo,
            subjects: c.subjects?.map((id) => id.toString()) || [],
            grade: c.grade as Grade,
            chatRoomId: c.chatRoomId,
            isDeleted: c.isDeleted ?? false,
          })
      );
      const totalCount = await this.classModel.countDocuments({
        isDeleted: false,
      });
      return { data: classes, totalCount };
    } catch (error) {
      throw new Error(`Failed to fetch classes: ${(error as Error).message}`);
    }
  }

  async findAllGrades(): Promise<{ grade: string }[]> {
    try {
      const uniqueGrades = await this.classModel.distinct('grade', {
        isDeleted: false,
      });
      return uniqueGrades.map((grade: string) => ({ grade }));
    } catch (error) {
      throw new Error(
        `Failed to fetch unique grades: ${(error as Error).message}`
      );
    }
  }

  async findByNameAndSection(
    name: string,
    section: string
  ): Promise<ClassEntity | null> {
    try {
      const classDoc = await this.classModel
        .findOne({ name, section, isDeleted: false })
        .populate('tutor', 'name _id')
        .lean();
      if (!classDoc) return null;

      return new ClassEntity({
        id: classDoc._id.toString(),
        name: classDoc.name,
        section: classDoc.section as Section,
        teachers: classDoc.teachers?.map((id) => id.toString()) || [],
        timetable: classDoc.timetable ? classDoc.timetable.toString() : null,
        students: classDoc.students?.map((id) => id.toString()) || [],
        totalStudents: classDoc.totalStudents || 0,
        tutor: classDoc.tutor ? (classDoc.tutor as any)._id.toString() : '',
        roomNo: classDoc.roomNo,
        subjects: classDoc.subjects?.map((id) => id.toString()) || [],
        grade: classDoc.grade as Grade,
        chatRoomId: classDoc.chatRoomId,
        isDeleted: classDoc.isDeleted ?? false,
      });
    } catch (error) {
      throw new Error(
        `Failed to retrieve class by name and section: ${(error as Error).message}`
      );
    }
  }

  async findByName(name: string): Promise<ClassEntity | null> {
    try {
      const classDoc = await this.classModel
        .findOne({ name, isDeleted: false })
        .populate('tutor', 'name _id')
        .lean();
      if (!classDoc) return null;

      return new ClassEntity({
        id: classDoc._id.toString(),
        name: classDoc.name,
        section: classDoc.section as Section,
        teachers: classDoc.teachers?.map((id) => id.toString()) || [],
        timetable: classDoc.timetable ? classDoc.timetable.toString() : null,
        students: classDoc.students?.map((id) => id.toString()) || [],
        totalStudents: classDoc.totalStudents || 0,
        tutor: classDoc.tutor ? (classDoc.tutor as any)._id.toString() : '',
        roomNo: classDoc.roomNo,
        subjects: classDoc.subjects?.map((id) => id.toString()) || [],
        grade: classDoc.grade as Grade,
        chatRoomId: classDoc.chatRoomId,
        isDeleted: classDoc.isDeleted ?? false,
      });
    } catch (error) {
      throw new Error(
        `Failed to retrieve class by name: ${(error as Error).message}`
      );
    }
  }

  async create(classData: Partial<ClassEntity>): Promise<ClassEntity> {
    try {
      if (
        !classData.tutor ||
        !classData.name ||
        !classData.roomNo ||
        !classData.grade ||
        !classData.section ||
        !classData.chatRoomId
      ) {
        throw new Error('Required fields are missing');
      }

      const newClass = await this.classModel.create({
        ...classData,
        tutor: new Types.ObjectId(classData.tutor),
        teachers: classData.teachers?.map((id) => new Types.ObjectId(id)) || [],
        students: classData.students?.map((id) => new Types.ObjectId(id)) || [],
        subjects: classData.subjects?.map((id) => new Types.ObjectId(id)) || [],
        timetable: classData.timetable
          ? new Types.ObjectId(classData.timetable)
          : null,
        totalStudents: classData.totalStudents ?? 0,
        isDeleted: classData.isDeleted ?? false,
      });

      const populatedClass = await this.classModel
        .findById(newClass._id)
        .populate('tutor', 'name _id')
        .lean();

      if (!populatedClass) throw new Error('Failed to retrieve created class');

      return new ClassEntity({
        id: populatedClass._id.toString(),
        name: populatedClass.name,
        section: populatedClass.section as Section,
        teachers: populatedClass.teachers?.map((id) => id.toString()) || [],
        timetable: populatedClass.timetable
          ? populatedClass.timetable.toString()
          : null,
        students: populatedClass.students?.map((id) => id.toString()) || [],
        totalStudents: populatedClass.totalStudents || 0,
        tutor: populatedClass.tutor
          ? (populatedClass.tutor as any)._id.toString()
          : '',
        roomNo: populatedClass.roomNo,
        subjects: populatedClass.subjects?.map((id) => id.toString()) || [],
        grade: populatedClass.grade as Grade,
        chatRoomId: populatedClass.chatRoomId,
        isDeleted: populatedClass.isDeleted ?? false,
      });
    } catch (error) {
      throw new Error(`Failed to create class: ${(error as Error).message}`);
    }
  }

  async findById(id: string): Promise<ClassEntity | null> {
    try {
      const classDoc = await this.classModel
        .findById(id)
        .where({ isDeleted: false })
        .populate('tutor', 'name _id')
        .lean();

      if (!classDoc) return null;

      return new ClassEntity({
        id: classDoc._id.toString(),
        name: classDoc.name,
        section: classDoc.section as Section,
        teachers: classDoc.teachers?.map((id) => id.toString()) || [],
        timetable: classDoc.timetable ? classDoc.timetable.toString() : null,
        students: classDoc.students?.map((id) => id.toString()) || [],
        totalStudents: classDoc.totalStudents || 0,
        tutor: classDoc.tutor ? (classDoc.tutor as any)._id.toString() : '',
        roomNo: classDoc.roomNo,
        subjects: classDoc.subjects?.map((id) => id.toString()) || [],
        grade: classDoc.grade as Grade,
        chatRoomId: classDoc.chatRoomId,
        isDeleted: classDoc.isDeleted ?? false,
      });
    } catch (error) {
      throw new Error(
        `Failed to retrieve class by ID: ${(error as Error).message}`
      );
    }
  }

  async findByGrade(grade: string): Promise<ClassEntity[]> {
    try {
      const rawClasses = await this.classModel
        .find({ grade, isDeleted: false })
        .populate('tutor', 'name _id')
        .lean();

      return rawClasses.map(
        (c) =>
          new ClassEntity({
            id: c._id.toString(),
            name: c.name,
            section: c.section as Section,
            teachers: c.teachers?.map((id) => id.toString()) || [],
            timetable: c.timetable ? c.timetable.toString() : null,
            students: c.students?.map((id) => id.toString()) || [],
            totalStudents: c.totalStudents || 0,
            tutor: c.tutor ? (c.tutor as any)._id.toString() : '',
            roomNo: c.roomNo,
            subjects: c.subjects?.map((id) => id.toString()) || [],
            grade: c.grade as Grade,
            chatRoomId: c.chatRoomId,
            isDeleted: c.isDeleted ?? false,
          })
      );
    } catch (error) {
      throw new Error(
        `Failed to retrieve classes by grade: ${(error as Error).message}`
      );
    }
  }

  async update(
    classId: string,
    classData: Partial<ClassEntity>
  ): Promise<ClassEntity> {
    try {
      // Validate required fields
      if (
        classData.name === '' ||
        classData.tutor === '' ||
        classData.roomNo === '' ||
        classData.grade === undefined ||
        classData.section === undefined
      ) {
        throw new Error('Required fields cannot be empty or undefined');
      }

      const updateData = {
        ...classData,
        tutor: classData.tutor
          ? new Types.ObjectId(classData.tutor)
          : undefined,
        teachers: classData.teachers?.map((id) => new Types.ObjectId(id)),
        students: classData.students?.map((id) => new Types.ObjectId(id)),
        subjects: classData.subjects?.map((id) => new Types.ObjectId(id)),
        timetable: classData.timetable
          ? new Types.ObjectId(classData.timetable)
          : classData.timetable,
        chatRoomId: classData.chatRoomId || undefined,
      };

      if (updateData.tutor === undefined) {
        delete updateData.tutor;
      }
      if (updateData.teachers === undefined) {
        delete updateData.teachers;
      }
      if (updateData.students === undefined) {
        delete updateData.students;
      }
      if (updateData.subjects === undefined) {
        delete updateData.subjects;
      }
      if (updateData.timetable === undefined) {
        delete updateData.timetable;
      }
      if (updateData.chatRoomId === undefined) {
        delete updateData.chatRoomId;
      }

      const updatedClass = await this.classModel
        .findByIdAndUpdate(classId, { $set: updateData }, { new: true })
        .where({ isDeleted: false })
        .populate('tutor', 'name _id')
        .lean();

      if (!updatedClass) throw new Error('Class not found');

      return new ClassEntity({
        id: updatedClass._id.toString(),
        name: updatedClass.name,
        section: updatedClass.section as Section,
        teachers: updatedClass.teachers?.map((id) => id.toString()) || [],
        timetable: updatedClass.timetable
          ? updatedClass.timetable.toString()
          : null,
        students: updatedClass.students?.map((id) => id.toString()) || [],
        totalStudents: updatedClass.totalStudents || 0,
        tutor: updatedClass.tutor
          ? (updatedClass.tutor as any)._id.toString()
          : '',
        roomNo: updatedClass.roomNo,
        subjects: updatedClass.subjects?.map((id) => id.toString()) || [],
        grade: updatedClass.grade as Grade,
        chatRoomId: updatedClass.chatRoomId,
        isDeleted: updatedClass.isDeleted ?? false,
      });
    } catch (error) {
      throw new Error(`Failed to update class: ${(error as Error).message}`);
    }
  }

  async fetchClass(): Promise<
    { _id: string; name: string; chatRoomId: string }[]
  > {
    try {
      const classes = await this.classModel
        .find({ isDeleted: false }, { _id: 1, name: 1, chatRoomId: 1 })
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

  async isStudentInClass(
    studentId: string,
    chatRoomId: string
  ): Promise<boolean> {
    try {
      const classDoc = await this.classModel.findOne({
        chatRoomId,
        students: new mongoose.Types.ObjectId(studentId),
        isDeleted: false,
      });
      return !!classDoc;
    } catch (error) {
      throw new Error(
        `Failed to verify student class membership: ${(error as Error).message}`
      );
    }
  }

  async isTeacherInClass(
    teacherId: string,
    chatRoomId: string
  ): Promise<boolean> {
    try {
      const classDoc = await this.classModel.findOne({
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
        `Failed to verify teacher class membership: ${(error as Error).message}`
      );
    }
  }

  async getClassesForTeacher(teacherId: string): Promise<Partial<IClass>[]> {
    try {
      const classes = await this.classModel
        .find({
          $or: [
            { teachers: new mongoose.Types.ObjectId(teacherId) },
            { tutor: new mongoose.Types.ObjectId(teacherId) },
          ],
          isDeleted: false,
        })
        .select('chatRoomId name grade section')
        .lean();
      return classes.map((doc) => ({
        id: doc._id.toString(),
        chatRoomId: doc.chatRoomId,
        name: doc.name,
        section: mapSection(doc.section),
        grade: mapGrade(doc.grade),
      }));
    } catch (error) {
      throw new Error(
        `Failed to fetch classes for teacher: ${(error as Error).message}`
      );
    }
  }

  async getClassForStudent(studentId: string): Promise<Partial<IClass> | null> {
    try {
      const classDoc = await this.classModel
        .findOne({
          students: new mongoose.Types.ObjectId(studentId),
          isDeleted: false,
        })
        .select('chatRoomId name grade section')
        .lean();
      if (!classDoc) return null;
      return {
        id: classDoc._id.toString(),
        chatRoomId: classDoc.chatRoomId,
        name: classDoc.name,
        section: mapSection(classDoc.section),
        grade: mapGrade(classDoc.grade),
      };
    } catch (error) {
      throw new Error(
        `Failed to fetch class for student: ${(error as Error).message}`
      );
    }
  }

  async getTopClasses(limit: number): Promise<TopClassDto[]> {
    try {
      const classes = await this.attendanceModel.aggregate([
        {
          $group: {
            _id: '$classId',
            present: {
              $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] },
            },
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
        { $match: { 'class.isDeleted': false } },
        {
          $project: {
            className: '$class.name',
            attendancePercentage: {
              $multiply: [{ $divide: ['$present', '$total'] }, 100],
            },
          },
        },
        { $sort: { attendancePercentage: -1 } },
        { $limit: limit },
      ]);
      return classes.map((cls) => ({
        className: cls.className,
        attendancePercentage: Math.round(cls.attendancePercentage),
      }));
    } catch (error) {
      throw new Error(
        `Failed to fetch top classes: ${(error as Error).message}`
      );
    }
  }
}
