import { TeacherEntity } from '../../../../domain/entities/teacher';
import { Gender } from '../../../../domain/types/enums';
import { ITeacher } from '../../../../domain/types/interfaces';
import { ITeacherModel } from '../interface/ITeacherModel';
import { ClassModel } from '../models/classModel';
import { SubjectModel } from '../models/subjectModel';

export function mapTeacherDocToEntity(doc: ITeacherModel): ITeacher {
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    gender: doc.gender as Gender,
    phoneNo: doc.phoneNo,
    empId: doc.empId,
    assignedClass:
      typeof doc.assignedClass === 'object' && doc.assignedClass !== null
        ? (doc.assignedClass as any).name
        : doc.assignedClass?.toString(),
    subject:
      typeof doc.subject === 'object' && doc.subject !== null
        ? (doc.subject as any).subjectName
        : doc.subject?.toString(),
    dateOfBirth: doc.dateOfBirth,
    profileImage: doc.profileImage || undefined,
    fileHash: doc.fileHash || undefined,
    specialization: doc.specialization || undefined,
    experienceYears: doc.experienceYears || undefined,
    qualification: doc.qualification || undefined,
    availability: doc.availability,
    isInitialLogin: doc.isInitialLogin,
    isDeleted: doc.isDeleted,
    refreshToken: doc.refreshToken,
  };
}

export async function mapTeacherEntityToDoc(
  teacher: TeacherEntity
): Promise<any> {
  const doc: any = { ...teacher };

  if (teacher.assignedClass && typeof teacher.assignedClass === 'string') {
    const classDoc = await ClassModel.findOne({ name: teacher.assignedClass });
    if (!classDoc)
      throw new Error(`Class '${teacher.assignedClass}' not found`);
    doc.assignedClass = classDoc.id;
  }

  if (teacher.subject && typeof teacher.subject === 'string') {
    const subjectDoc = await SubjectModel.findOne({
      subjectName: teacher.subject,
    });
    if (!subjectDoc) throw new Error(`Subject '${teacher.subject}' not found`);
    doc.subject = subjectDoc.id;
  }

  return doc;
}
