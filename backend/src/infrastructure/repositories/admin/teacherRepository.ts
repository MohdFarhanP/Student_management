import { TeacherModel } from '../../database/models/teacherModel';
import { ITeacherRepository } from '../../../domain/interface/admin/ITeacherRepository';
import { Teacher } from '../../../domain/entities/teacher';
import { ClassModel } from '../../database/models/classModel';
import { SubjectModel } from '../../database/models/subjectModel';
import { LiveSessionModel } from '../../database/models/liveSessionModel'; 
import mongoose, { Types } from 'mongoose';
import { ObjectId } from '../../../types';
import { ClassSubjectDto, ITeacher, ScheduleDto, SessionDto } from '../../../domain/types/interfaces';
import { Gender, SessionStatus } from '../../../domain/types/enums';
import { Day } from '../../../domain/types/enums';
import TimetableModel from '../../database/models/timeTableModel';

interface PopulatedTeacher {
  _id: string | mongoose.Types.ObjectId;
  name: string;
  email: string;
  gender: Gender;
  phoneNo: number;
  empId: string;
  assignedClass?: { name: string } | null;
  subject?: { subjectName: string } | null;
  dateOfBirth: string;
  availability: { [key in Day]: number[] };
  profileImage?: string;
  fileHash?: string;
  specialization?: string;
  experienceYears?: number;
  qualification?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class TeacherRepository implements ITeacherRepository {
  async insertMany(teachers: Teacher[]): Promise<void> {
    if (!teachers || teachers.length === 0) return;

    const processedTeachers = await Promise.all(
      teachers.map(async (teacher) => {
        if (teacher.assignedClass && typeof teacher.assignedClass === 'string') {
          const classDoc = await ClassModel.findOne({ name: teacher.assignedClass });
          if (!classDoc) throw new Error(`Class '${teacher.assignedClass}' not found`);
          teacher.assignedClass = classDoc._id;
        }
        if (teacher.subject && typeof teacher.subject === 'string') {
          const subjectDoc = await SubjectModel.findOne({ subjectName: teacher.subject });
          if (!subjectDoc) throw new Error(`Subject '${teacher.subject}' not found`);
          teacher.subject = subjectDoc._id;
        }
        return teacher;
      })
    );

    await TeacherModel.insertMany(processedTeachers);
  }

  async getAllByLimit(page: number, limit: number): Promise<{ data: Teacher[]; totalCount: number }> {
    const skip = (page - 1) * limit;
    const rawTeachersData = await TeacherModel.find({ isDeleted: false })
      .skip(skip)
      .limit(limit)
      .select('-password')
      .select('-availability')
      .populate('assignedClass', 'name')
      .populate('subject', 'subjectName')
      .lean();

    const teachersData = rawTeachersData as unknown as PopulatedTeacher[];

    const teachers = teachersData.map((t) => new Teacher({
      id: t._id.toString(),
      name: t.name,
      email: t.email,
      gender: t.gender,
      phoneNo: t.phoneNo,
      empId: t.empId,
      assignedClass: t.assignedClass ? t.assignedClass.name : null,
      subject: t.subject ? t.subject.subjectName : null,
      dateOfBirth: t.dateOfBirth,
      profileImage: t.profileImage || '',
      fileHash: t.fileHash,
      specialization: t.specialization || '',
      experienceYears: t.experienceYears || 0,
      qualification: t.qualification || '',
    }));

    const totalCount = await TeacherModel.countDocuments({ isDeleted: false });
    return { data: teachers, totalCount };
  }

  async getAll(): Promise<{ data: Teacher[] }> {
    const rawTeachersData = await TeacherModel.find({ isDeleted: false })
      .select('-password')
      .populate('assignedClass', 'name')
      .populate('subject', 'subjectName')
      .lean();

    const teachersData = rawTeachersData as unknown as PopulatedTeacher[];

    const teachers = teachersData.map((t) => new Teacher({
      id: t._id.toString(),
      name: t.name,
      email: t.email,
      gender: t.gender,
      phoneNo: t.phoneNo,
      empId: t.empId,
      assignedClass: t.assignedClass ? t.assignedClass.name : null,
      subject: t.subject ? t.subject.subjectName : null,
      dateOfBirth: t.dateOfBirth,
      profileImage: t.profileImage || '',
      fileHash: t.fileHash,
      specialization: t.specialization || '',
      experienceYears: t.experienceYears || 0,
      qualification: t.qualification || '',
    }));

    return { data: teachers };
  }

  async getById(teacherId: ObjectId | string): Promise<Teacher> {
    const rawTeacher = await TeacherModel.findOne({ _id: teacherId, isDeleted: false })
      .populate('assignedClass', 'name')
      .populate('subject', 'subjectName')
      .lean();

    if (!rawTeacher) throw new Error('Teacher not found');

    const teacherData = rawTeacher as unknown as PopulatedTeacher;

    return new Teacher({
      id: teacherData._id.toString(),
      name: teacherData.name,
      email: teacherData.email,
      gender: teacherData.gender,
      phoneNo: teacherData.phoneNo,
      empId: teacherData.empId,
      assignedClass: teacherData.assignedClass ? teacherData.assignedClass.name : null,
      subject: teacherData.subject ? teacherData.subject.subjectName : null,
      dateOfBirth: teacherData.dateOfBirth,
      profileImage: teacherData.profileImage || '',
      fileHash: teacherData.fileHash,
      specialization: teacherData.specialization || '',
      experienceYears: teacherData.experienceYears || 0,
      qualification: teacherData.qualification || '',
      availability: teacherData.availability,
    });
  }

  async getByEmail(email: string): Promise<Teacher | null> {
    const rawTeacher = await TeacherModel.findOne({ email, isDeleted: false })
      .populate('assignedClass', 'name')
      .populate('subject', 'subjectName')
      .lean();

    if (!rawTeacher) return null;

    const teacherData = rawTeacher as unknown as PopulatedTeacher;

    return new Teacher({
      id: teacherData._id.toString(),
      name: teacherData.name,
      email: teacherData.email,
      gender: teacherData.gender,
      phoneNo: teacherData.phoneNo,
      empId: teacherData.empId,
      assignedClass: teacherData.assignedClass ? teacherData.assignedClass.name : null,
      subject: teacherData.subject ? teacherData.subject.subjectName : null,
      dateOfBirth: teacherData.dateOfBirth,
      profileImage: teacherData.profileImage || '',
      fileHash: teacherData.fileHash,
      specialization: teacherData.specialization || '',
      experienceYears: teacherData.experienceYears || 0,
      qualification: teacherData.qualification || '',
    });
  }

  async update(id: string, data: Partial<ITeacher>): Promise<Teacher> {
    if (data.subject && typeof data.subject === 'string') {
      const subjectDoc = await SubjectModel.findOne({ subjectName: data.subject });
      if (!subjectDoc) throw new Error(`Subject '${data.subject}' not found`);
      data.subject = subjectDoc._id;
    }
    if (data.assignedClass) {
      console.log('assignedClass',data.assignedClass)
      const classDoc = await ClassModel.findById(data.assignedClass);
      console.log('this is classDoc from teacher repo', classDoc);
      if (!classDoc) throw new Error(`Class '${data.assignedClass}' not found`);
      data.assignedClass = classDoc._id;
    }
    if (data.gender && typeof data.gender === 'string') {
      if (data.gender !== Gender.Male && data.gender !== Gender.Female) {
        throw new Error(`Invalid gender value: '${data.gender}'`);
      }
      data.gender = data.gender as Gender;
    }
    const updatedTeacher = await TeacherModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    )
      .populate('assignedClass', 'name')
      .populate('subject', 'subjectName')
      .lean();

    if (!updatedTeacher) throw new Error('Teacher not found or update failed');

    const teacherData = updatedTeacher as unknown as PopulatedTeacher;

    return new Teacher({
      id: teacherData._id.toString(),
      name: teacherData.name,
      email: teacherData.email,
      gender: teacherData.gender,
      phoneNo: teacherData.phoneNo,
      empId: teacherData.empId,
      assignedClass: teacherData.assignedClass ? teacherData.assignedClass.name : null,
      dateOfBirth: teacherData.dateOfBirth,
      profileImage: teacherData.profileImage || '',
      fileHash: teacherData.fileHash,
      specialization: teacherData.specialization || '',
      experienceYears: teacherData.experienceYears || 0,
      qualification: teacherData.qualification || '',
    });
  }

  async create(data: Partial<ITeacher>): Promise<Teacher> {
    if (data.subject && typeof data.subject === 'string') {
      const subjectDoc = await SubjectModel.findOne({ subjectName: data.subject });
      if (!subjectDoc) throw new Error(`Subject '${data.subject}' not found`);
      data.subject = subjectDoc._id;
    }
    if (data.assignedClass && typeof data.assignedClass === 'string') {
      const classDoc = await ClassModel.findOne({ name: data.assignedClass });
      if (!classDoc) throw new Error(`Class '${data.assignedClass}' not found`);
      data.assignedClass = classDoc._id;
    }
    if (data.gender && typeof data.gender === 'string') {
      if (data.gender !== Gender.Male && data.gender !== Gender.Female) {
        throw new Error(`Invalid gender value: '${data.gender}'`);
      }
      data.gender = data.gender as Gender;
    }
    const newTeacher = await TeacherModel.create(data);
    const populatedTeacher = await TeacherModel.findById(newTeacher._id)
      .populate('assignedClass', 'name')
      .populate('subject', 'subjectName')
      .lean();

    if (!populatedTeacher) throw new Error('Failed to create teacher');

    const teacherData = populatedTeacher as unknown as PopulatedTeacher;

    return new Teacher({
      id: teacherData._id.toString(),
      name: teacherData.name,
      email: teacherData.email,
      gender: teacherData.gender,
      phoneNo: teacherData.phoneNo,
      empId: teacherData.empId,
      assignedClass: teacherData.assignedClass ? teacherData.assignedClass.name : null,
      subject: teacherData.subject ? teacherData.subject.subjectName : null,
      dateOfBirth: teacherData.dateOfBirth,
      profileImage: teacherData.profileImage || '',
      fileHash: teacherData.fileHash,
      specialization: teacherData.specialization || '',
      experienceYears: teacherData.experienceYears || 0,
      qualification: teacherData.qualification || '',
    });
  }
  
  async save(teacher: Teacher): Promise<void> {
    const updateData = {
      name: teacher.name,
      email: teacher.email,
      empId: teacher.empId,
      dateOfBirth: teacher.dateOfBirth,
      gender: teacher.gender,
      phoneNo: teacher.phoneNo,
      assignedClass: teacher.assignedClass ? new Types.ObjectId(teacher.assignedClass) : null,
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
    const result = await TeacherModel.findByIdAndUpdate(id, { isDeleted: true });
    if (!result) throw new Error('Teacher not found or already deleted');
  }

async getTeacherClasses(teacherId: string): Promise<ClassSubjectDto[]> {
  const classes = await ClassModel
    .find({
      $or: [
        { teachers: new Types.ObjectId(teacherId) },
        { tutor: new Types.ObjectId(teacherId) }
      ]
    })
    .populate('subjects', 'subjectName');

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
  const timetables = await TimetableModel
    .find()
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
    const sessions = await LiveSessionModel
      .find({
        teacherId,
        scheduledAt: { $gte: now }, // Only future sessions
        status: { $in: [SessionStatus.Scheduled, SessionStatus.Ongoing] }, // Scheduled or Ongoing
      })
      .lean();

    const sessionDtos: SessionDto[] = [];
    for (const ses of sessions) {
      const classDoc = await ClassModel
        .findOne({ _id: ses.classId })
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