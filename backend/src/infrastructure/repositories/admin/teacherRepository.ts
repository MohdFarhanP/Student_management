import { TeacherModel } from '../../database/mongoos/models/teacherModel';
import { ITeacherRepository } from '../../../domain/repositories/ITeacherRepository';
import { TeacherEntity } from '../../../domain/entities/teacher';
import { ClassModel } from '../../database/mongoos/models/classModel';
import { LiveSessionModel } from '../../database/mongoos/models/liveSessionModel';
import { Types } from 'mongoose';
import { ObjectId } from '../../../domain/types/common';
import { ITeacher } from '../../../domain/types/interfaces';
import { SessionStatus } from '../../../domain/types/enums';
import TimetableModel from '../../database/mongoos/models/timeTableModel';
import { ClassSubjectDto } from '../../../application/dtos/classDtos';
import {
  ScheduleDto,
  SessionDto,
} from '../../../application/dtos/liveSessionDtos';
import {
  mapTeacherDocToEntity,
  mapTeacherEntityToDoc,
} from '../../database/mongoos/helpers/teacherMapper';

export class TeacherRepository implements ITeacherRepository {
  async insertMany(teachers: TeacherEntity[]): Promise<void> {
    if (!teachers || teachers.length === 0) return;

    const processedTeachers = await Promise.all(
      teachers.map(async (teacher) => mapTeacherEntityToDoc(teacher))
    );

    await TeacherModel.insertMany(processedTeachers);
  }

  async getAllByLimit(
    page: number,
    limit: number
  ): Promise<{ data: TeacherEntity[]; totalCount: number }> {
    const skip = (page - 1) * limit;
    const teacherDoc = await TeacherModel.find({ isDeleted: false })
      .skip(skip)
      .limit(limit)
      .select('-password')
      .select('-availability')
      .populate('assignedClass', 'name')
      .populate('subject', 'subjectName')
      .lean();

    const teachers = teacherDoc.map((t) => mapTeacherDocToEntity(t));

    const totalCount = await TeacherModel.countDocuments({ isDeleted: false });
    return { data: teachers, totalCount };
  }

  async getAll(): Promise<{ data: TeacherEntity[] }> {
    const teacherDoc = await TeacherModel.find({ isDeleted: false })
      .select('-password')
      .populate('assignedClass', 'name')
      .populate('subject', 'subjectName')
      .lean();

    const teachers = teacherDoc.map((t) => mapTeacherDocToEntity(t));

    return { data: teachers };
  }

  async getById(teacherId: ObjectId | string): Promise<TeacherEntity> {
    const teacherDoc = await TeacherModel.findOne({
      _id: teacherId,
      isDeleted: false,
    })
      .populate('assignedClass', 'name')
      .populate('subject', 'subjectName')
      .lean();

    if (!teacherDoc) throw new Error('Teacher not found');

    return mapTeacherDocToEntity(teacherDoc);
  }

  async getByEmail(email: string): Promise<TeacherEntity | null> {
    const teacherDoc = await TeacherModel.findOne({ email, isDeleted: false })
      .populate('assignedClass', 'name')
      .populate('subject', 'subjectName')
      .lean();

    if (!teacherDoc) return null;

    return mapTeacherDocToEntity(teacherDoc);
  }

  async update(id: string, data: Partial<ITeacher>): Promise<TeacherEntity> {
    const doc = await mapTeacherEntityToDoc(data as TeacherEntity);

    const updatedTeacher = await TeacherModel.findByIdAndUpdate(
      id,
      { $set: doc },
      { new: true, runValidators: true }
    )
      .populate('assignedClass', 'name')
      .populate('subject', 'subjectName')
      .lean();

    if (!updatedTeacher) throw new Error('Teacher not found or update failed');

    return mapTeacherDocToEntity(updatedTeacher);
  }

  async create(data: Partial<ITeacher>): Promise<TeacherEntity> {
    const doc = await mapTeacherEntityToDoc(data as TeacherEntity);

    const newTeacher = await TeacherModel.create(doc);
    const populatedTeacher = await TeacherModel.findById(newTeacher._id)
      .populate('assignedClass', 'name')
      .populate('subject', 'subjectName')
      .lean();

    if (!populatedTeacher) throw new Error('Failed to create teacher');

    return mapTeacherDocToEntity(populatedTeacher);
  }

  async save(teacher: TeacherEntity): Promise<void> {
    const updateData = {
      name: teacher.name,
      email: teacher.email,
      empId: teacher.empId,
      dateOfBirth: teacher.dateOfBirth,
      gender: teacher.gender,
      phoneNo: teacher.phoneNo,
      assignedClass: teacher.assignedClass
        ? new Types.ObjectId(teacher.assignedClass)
        : null,
      subject: teacher.subject ? new Types.ObjectId(teacher.subject) : null,
      profileImage: teacher.profileImage,
      fileHash: teacher.fileHash,
      specialization: teacher.specialization,
      experienceYears: teacher.experienceYears,
      qualification: teacher.qualification,
    };

    await TeacherModel.findByIdAndUpdate(
      new Types.ObjectId(teacher.id),
      { $set: updateData },
      { runValidators: true }
    );
  }

  async delete(id: string): Promise<void> {
    const result = await TeacherModel.findByIdAndUpdate(id, {
      isDeleted: true,
    });
    if (!result) throw new Error('Teacher not found or already deleted');
  }

  async getTeacherClasses(teacherId: string): Promise<ClassSubjectDto[]> {
    const classes = await ClassModel.find({
      $or: [
        { teachers: new Types.ObjectId(teacherId) },
        { tutor: new Types.ObjectId(teacherId) },
      ],
    }).populate('subjects', 'subjectName');

    return classes.flatMap((cls) => {
      if (!Array.isArray(cls.subjects)) return [];

      const data = cls.subjects.map((sub: any) => ({
        className: cls.name,
        subject: sub?.subjectName || null,
        classId: cls._id.toString(),
      }));
      return data;
    });
  }

  async getTodaySchedule(teacherId: string): Promise<ScheduleDto[]> {
    const today = new Date();
    const dayName = today.toLocaleString('en-US', { weekday: 'long' }) as
      | 'Monday'
      | 'Tuesday'
      | 'Wednesday'
      | 'Thursday'
      | 'Friday';

    // Get all timetables with class names populated
    const timetables = await TimetableModel.find()
      .populate('classId', 'name') // Populate class name
      .lean();

    const schedules: ScheduleDto[] = [];

    for (const timetable of timetables) {
      const slots = timetable.schedule?.[dayName] || [];

      for (const slot of slots) {
        if (slot.teacherId?.toString() === teacherId && slot.subject) {
          schedules.push({
            period: slot.period,
            subject: slot.subject,
            className: (timetable.classId as any).name,
          });
        }
      }
    }

    // Optional: sort by period
    return schedules.sort((a, b) => a.period - b.period);
  }

  async getLiveSessions(teacherId: string): Promise<SessionDto[]> {
    const now = new Date();
    const sessions = await LiveSessionModel.find({
      teacherId,
      scheduledAt: { $gte: now }, // Only future sessions
      status: { $in: [SessionStatus.Scheduled, SessionStatus.Ongoing] }, // Scheduled or Ongoing
    }).lean();

    const sessionDtos: SessionDto[] = [];
    for (const ses of sessions) {
      const classDoc = await ClassModel.findOne({ _id: ses.classId })
        .select('name')
        .lean();
      const className = classDoc ? classDoc.name : 'Unknown Class';

      const startTime = new Date(ses.scheduledAt);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
      const isOngoing =
        ses.status === SessionStatus.Ongoing &&
        now >= startTime &&
        now <= endTime;

      sessionDtos.push({
        title: ses.title,
        className,
        time: `${startTime.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })} - ${endTime.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}`,
        isOngoing,
        joinLink: `/join-session/${ses.id}`,
      });
    }

    return sessionDtos;
  }
}
