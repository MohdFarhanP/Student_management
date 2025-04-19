import { Types } from 'mongoose';
import { ClassEntity } from '../../../domain/entities/class';
import { ClassModel } from '../../database/models/classModel';
import { TeacherModel } from '../../database/models/teacherModel';

interface PopulatedClass {
  _id: Types.ObjectId;
  name: string;
  section: string;
  teachers: Types.ObjectId[];
  timetable: Types.ObjectId | null;
  students: Types.ObjectId[];
  totalStudents: number;
  tutor: { name: string };
  roomNo: string;
  subjects: Types.ObjectId[];
  grade: string;
}

export class ClassRepository {
  constructor(
    private classModel = ClassModel,
    private teacherModel = TeacherModel
  ) {}
  async findAllGrades(): Promise<{ grade: string }[]> {
    try {
      const uniqueGrades = await this.classModel.distinct('grade');
      return uniqueGrades.map((grade: string) => ({ grade }));
    } catch (error) {
      console.error('Error fetching unique grades:', error);
      throw new Error('Failed to fetch unique grades from database');
    }
  }
  async findByNameAndSection(
    name: string,
    section: string
  ): Promise<ClassEntity | null> {
    try {
      const classDoc = await this.classModel
        .findOne({ name, section })
        .populate('tutor', 'name')
        .lean();
      if (!classDoc) return null;

      const tutor = classDoc.tutor as unknown as { name: string };
      return ClassEntity.create({
        id: classDoc._id.toString(),
        name: classDoc.name,
        section: classDoc.section,
        teachers: classDoc.teachers,
        timetable: classDoc.timetable,
        students: classDoc.students,
        totalStudents: classDoc.totalStudents,
        tutor: tutor.name,
        roomNo: classDoc.roomNo,
        subjects: classDoc.subjects,
        grade: classDoc.grade,
      });
    } catch (error) {
      console.error('Error finding class by name and section:', error);
      throw new Error('Failed to retrieve class by name and section');
    }
  }
  async create(classData: Partial<ClassEntity>): Promise<ClassEntity> {
    try {
      const newClass = await this.classModel.create({
        ...classData,
        tutor: classData.tutor
          ? new Types.ObjectId(classData.tutor)
          : undefined,
      });
      const populatedClass = await this.classModel
        .findById(newClass._id)
        .populate('tutor', 'name')
        .lean();

      if (!populatedClass) throw new Error('Failed to retrieve created class');

      const tutor = populatedClass.tutor as unknown as { name: string };
      return ClassEntity.create({
        id: populatedClass._id.toString(),
        name: populatedClass.name,
        section: populatedClass.section,
        teachers: populatedClass.teachers,
        timetable: populatedClass.timetable,
        students: populatedClass.students,
        totalStudents: populatedClass.totalStudents,
        tutor: tutor.name,
        roomNo: populatedClass.roomNo,
        subjects: populatedClass.subjects,
        grade: populatedClass.grade,
      });
    } catch (error) {
      console.error('Error creating class:', error);
      throw new Error('Failed to create class in database');
    }
  }
  async findAll(
    page: number,
    limit: number
  ): Promise<{ data: ClassEntity[]; totalCount: number }> {
    try {
      const skip = (page - 1) * limit;
      const rawClasses = await this.classModel
        .find()
        .skip(skip)
        .limit(limit)
        .populate('tutor', 'name')
        .lean();

      const classesData = rawClasses as unknown as PopulatedClass[];

      const classes = classesData.map((c) =>
        ClassEntity.create({
          id: c._id.toString(),
          name: c.name,
          section: c.section,
          teachers: c.teachers,
          timetable: c.timetable,
          students: c.students,
          totalStudents: c.totalStudents,
          tutor: c.tutor ? c.tutor.name : 'No Tutor Assigned',
          roomNo: c.roomNo,
          subjects: c.subjects,
          grade: c.grade,
        })
      );

      const totalCount = await this.classModel.countDocuments();
      return { data: classes, totalCount };
    } catch (error) {
      console.error('Error fetching classes:', error);
      throw new Error('Failed to fetch classes from database');
    }
  }
  async findById(id: string): Promise<ClassEntity | null> {
    try {
      const classDoc = await this.classModel
        .findById(id)
        .populate('tutor', 'name')
        .lean();

      if (!classDoc) return null;

      const tutor = classDoc.tutor as unknown as { name: string };
      return ClassEntity.create({
        id: classDoc._id.toString(),
        name: classDoc.name,
        section: classDoc.section,
        teachers: classDoc.teachers,
        timetable: classDoc.timetable,
        students: classDoc.students,
        totalStudents: classDoc.totalStudents,
        tutor: tutor.name,
        roomNo: classDoc.roomNo,
        subjects: classDoc.subjects,
        grade: classDoc.grade,
      });
    } catch (error) {
      console.error('Error finding class by ID:', error);
      throw new Error('Failed to retrieve class by ID');
    }
  }
  async findByGrade(grade: string): Promise<ClassEntity[]> {
    try {
      const rawClasses = await this.classModel
        .find({ grade })
        .populate('tutor', 'name')
        .lean();

      const classesData = rawClasses as unknown as PopulatedClass[];
      return classesData.map((c) =>
        ClassEntity.create({
          id: c._id.toString(),
          name: c.name,
          section: c.section,
          teachers: c.teachers,
          timetable: c.timetable,
          students: c.students,
          totalStudents: c.totalStudents,
          tutor: c.tutor ? c.tutor.name : '',
          roomNo: c.roomNo,
          subjects: c.subjects,
          grade: c.grade,
        })
      );
    } catch (error) {
      console.error('Error finding classes by grade:', error);
      throw new Error('Failed to retrieve classes by grade');
    }
  }
  async update(
    classGrade: string,
    classData: Partial<ClassEntity>
  ): Promise<ClassEntity> {
    try {
      const updatedClass = await this.classModel
        .findOneAndUpdate(
          { grade: classGrade },
          {
            $set: {
              ...classData,
              tutor: classData.tutor
                ? new Types.ObjectId(classData.tutor)
                : undefined,
            },
          },
          { new: true }
        )
        .populate('tutor', 'name')
        .lean();

      if (!updatedClass) throw new Error('Class not found');

      const tutor = updatedClass.tutor as unknown as { name: string };
      return ClassEntity.create({
        id: updatedClass._id.toString(),
        name: updatedClass.name,
        section: updatedClass.section,
        teachers: updatedClass.teachers,
        timetable: updatedClass.timetable,
        students: updatedClass.students,
        totalStudents: updatedClass.totalStudents,
        tutor: tutor.name,
        roomNo: updatedClass.roomNo,
        subjects: updatedClass.subjects,
        grade: updatedClass.grade,
      });
    } catch (error) {
      console.error('Error updating class:', error);
      throw new Error('Failed to update class in database');
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
      console.error('Error fetching classes:', error);
      throw new Error('Failed to fetch classes from database');
    }
  }
}
