import { studentModel } from '../../database/mongoos/models/studentModel';
import { ClassModel } from '../../database/mongoos/models/classModel';
import { IStudentRepository } from '../../../domain/repositories/IStudentRepository';
import { StudentEntity } from '../../../domain/entities/student';
import { IStudent } from '../../../domain/types/interfaces';
import { LiveSessionModel } from '../../database/mongoos/models/liveSessionModel';
import { format } from 'date-fns';
import { UserInfo } from '../../../domain/types/interfaces';
import mongoose from 'mongoose';
import { ILiveSessionDto } from '../../../application/dtos/liveSessionDtos';
import { mapToFullStudent } from '../../database/mongoos/helpers/studentMapper';
import logger from '../../../logger';

export class StudentRepository implements IStudentRepository {
  async insertMany(students: StudentEntity[]): Promise<void> {
    if (!students || students.length === 0) return;

    const classMap = new Map<string, string>(); // Cache class name to ObjectId
    const classStudentMap = new Map<string, string[]>(); // classId => studentIds

    // Step 1: Convert class name to ObjectId and prepare for bulk insert
    const processedStudents = await Promise.all(
      students.map(async (student) => {
        if (student.class && typeof student.class === 'string') {
          let classId = classMap.get(student.class);
          if (!classId) {
            const classDoc = await ClassModel.findOne({ name: student.class });
            if (!classDoc)
              throw new Error(`Class '${student.class}' not found`);
            classId = classDoc._id.toString();
            classMap.set(student.class, classId);
          }
          student.class = classId;

          // Prepare to push student IDs into class
          if (!classStudentMap.has(classId)) classStudentMap.set(classId, []);
        }
        return student;
      })
    );

    // Step 2: Bulk insert students
    const insertedStudents = await studentModel.insertMany(processedStudents);

    // Step 3: Organize students by class
    insertedStudents.forEach((student) => {
      const classId = student.class?.toString();
      if (classId) {
        classStudentMap.get(classId)?.push(student._id.toString());
      }
    });

    // Step 4: Update each class with students and total count
    for (const [classId, studentIds] of classStudentMap.entries()) {
      await ClassModel.findByIdAndUpdate(
        classId,
        {
          $push: { students: { $each: studentIds } },
          $inc: { totalStudents: studentIds.length },
        },
        { new: true }
      );
    }
  }

  async getAll(
    page: number,
    limit: number
  ): Promise<{ students: StudentEntity[]; totalCount: number }> {
    const skip = (page - 1) * limit;

    const rawStudentsData = await studentModel
      .find({ isDeleted: false })
      .skip(skip)
      .limit(limit)
      .select('-password')
      .populate('class', 'name')
      .lean();

    const students = rawStudentsData.map(
      (s) => new StudentEntity(mapToFullStudent(s))
    );

    const totalCount = await studentModel.countDocuments({ isDeleted: false });
    return { students, totalCount };
  }

  async findById(id: string): Promise<StudentEntity | null> {
    const student = await studentModel
      .findOne({ _id: id, isDeleted: false })
      .lean();
    if (!student) return null;
    return new StudentEntity(mapToFullStudent(student));
  }

  async findByPhoneNo(
    userId: string,
    phonNo: number
  ): Promise<StudentEntity | null> {
    logger.debug('user id ', userId);
    const student = await studentModel
      .findOne({
        'address.phoneNo': phonNo,
        isDeleted: false,
        _id: { $ne: new mongoose.Types.ObjectId(userId) },
      })
      .lean();
    logger.debug('findByphoneNO in student repo', student);
    if (!student) return null;
    return new StudentEntity(mapToFullStudent(student));
  }

  async findManyByIds(ids: string[]): Promise<UserInfo[]> {
    const usersData = await studentModel.find({ _id: { $in: ids } });
    return usersData.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: 'Student',
    }));
  }

  async create(data: Partial<IStudent>): Promise<StudentEntity> {
    const existStudent = await studentModel.findOne({
      email: data.email,
      isDeleted: false,
    });
    if (existStudent) {
      throw new Error('Student already exists');
    }

    // Convert class name to ObjectId
    if (data.class && typeof data.class === 'string') {
      const classDoc = await ClassModel.findOne({ name: data.class });
      if (!classDoc) throw new Error(`Class '${data.class}' not found`);
      data.class = classDoc.id;
    }

    // Validate required fields
    if (
      !data.name ||
      !data.email ||
      !data.roleNumber ||
      !data.dob ||
      !data.gender ||
      data.age === undefined ||
      !data.address
    ) {
      throw new Error('Missing required fields to create a student');
    }

    const newStudent = await studentModel.create(data);

    // Return domain entity (with proper mapping)
    return new StudentEntity(mapToFullStudent(newStudent.toObject()));
  }

  async update(id: string, data: Partial<IStudent>): Promise<StudentEntity> {
    if (data.class && typeof data.class === 'string') {
      const classDoc = await ClassModel.findOne({ name: data.class });
      if (!classDoc) throw new Error(`Class '${data.class}' not found`);
      data.class = classDoc.id;
    }
    const updatedStudent = await studentModel
      .findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
      .lean();
    if (!updatedStudent) throw new Error('Student not found');
    return new StudentEntity(mapToFullStudent(updatedStudent));
  }

  async delete(id: string): Promise<void> {
    const result = await studentModel.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true }
    );
    if (!result) throw new Error('Student not found');
  }

  async getSessions(userId: string): Promise<ILiveSessionDto[] | null> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const sessions = await LiveSessionModel.find({
      studentIds: { $in: [userId] },
      scheduledAt: { $gte: startOfDay, $lte: endOfDay },
      status: 'SCHEDULED',
    }).lean();

    const now = new Date();

    return sessions.map((session) => {
      const start = new Date(session.scheduledAt);
      const end = new Date(start.getTime() + 60 * 60000); // Add 1 hour

      return {
        title: session.title,
        time: `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`,
        isOngoing: now >= start && now <= end,
        // joinLink want to be add later
      };
    });
  }

  async getProfile(email: string): Promise<StudentEntity | null> {
    const rawStudent = await studentModel
      .findOne({ email, isDeleted: false })
      .select('-password')
      .populate('class', 'name')
      .lean();

    if (!rawStudent) return null;
    return new StudentEntity(mapToFullStudent(rawStudent));
  }

  async findByEmail(email: string): Promise<StudentEntity | null> {
    const student = await studentModel
      .findOne({ email, isDeleted: false })
      .lean();
    if (!student) return null;
    return new StudentEntity(mapToFullStudent(student));
  }

  async getStudentsByClass(classId: string): Promise<StudentEntity[]> {
    const students = await studentModel
      .find({ class: classId, isDeleted: false })
      .populate('class', 'name')
      .lean();

    return students.map(
      (student) => new StudentEntity(mapToFullStudent(student))
    );
  }

  async addStudentToClass(classId: string, studentId: string): Promise<void> {
    await ClassModel.findByIdAndUpdate(
      classId,
      {
        $addToSet: { students: studentId },
        $inc: { totalStudents: 1 },
      },
      { new: true }
    );
  }

  async removeStudentFromClass(
    classId: string,
    studentId: string
  ): Promise<void> {
    await ClassModel.findByIdAndUpdate(
      classId,
      {
        $pull: { students: studentId },
        $inc: { totalStudents: -1 },
      },
      { new: true }
    );
  }

async search(quary: string): Promise<StudentEntity[] | null> {
    const rawStudentsData = await studentModel
      .find({ name: { $regex: quary, $options: 'i' }, isDeleted: false })
      .lean();
    if (!rawStudentsData) return null;
    const students = rawStudentsData.map(
      (s) => new StudentEntity(mapToFullStudent(s))
    );
    return students;
  }
}
