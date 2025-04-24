import { SubjectEntity } from '../../../domain/entities/subject';
import { SubjectModel } from '../../database/models/subjectModel';
import { Types } from 'mongoose';
import { ISubjectRepository } from '../../../domain/interface/ISubjectRepository';

export class SubjectRepository implements ISubjectRepository {
  async create(subjectData: SubjectEntity): Promise<SubjectEntity> {
    try {
      const subject = await SubjectModel.create(subjectData);
      const populatedSubject = await subject.populate('teachers', 'name');

      const teacherNames = Array.isArray(populatedSubject.teachers) 
      ? populatedSubject.teachers.map((teacher:any)=> teacher.name)
       : [];
      console.log('teacher names',teacherNames);
      return SubjectEntity.create({
        id: populatedSubject._id.toString(),
        subjectName: populatedSubject.subjectName,
        teachers: teacherNames,
        notes: populatedSubject.notes,
      });

    } catch (error) {
      throw new Error(`Failed to create subject: ${(error as Error).message}`);
    }
  }

  async findByName(subjectName: string): Promise<SubjectEntity | null> {
    try {
      const subject = await SubjectModel.findOne({ subjectName })
      .populate('teachers', 'name')
      .lean();

      if (!subject) return null;

      const teacherNames = Array.isArray(subject.teachers)
      ? subject.teachers.map((teacher: any) => teacher.name)
      : [];
      console.log('teacher names',teacherNames);
      return SubjectEntity.create({
        id: subject._id.toString(),
        subjectName: subject.subjectName,
        teachers: teacherNames,
        notes: subject.notes,
      });
    } catch (error) {
      throw new Error(`Failed to find subject by name: ${(error as Error).message}`);
    }
  }

  async findByIds(subjectIds: Types.ObjectId[]): Promise<SubjectEntity[]> {
    try {
      const subjects = await SubjectModel.find({
        _id: { $in: subjectIds },
      })      
      .populate('teachers', 'name')
      .lean();
      subjects.map((s)=>console.log(s.teachers))
      return subjects.map((subject) =>
        SubjectEntity.create({
          id: subject._id.toString(),
          subjectName: subject.subjectName,
          teachers: subject.teachers,
          notes: subject.notes,
        })
      );
    } catch (error) {
      throw new Error(`Failed to find subjects by IDs: ${(error as Error).message}`);
    }
  }

  async update(id: string, subjectData: Partial<SubjectEntity>): Promise<SubjectEntity | null> {
    try {
      const updatedSubject = await SubjectModel.findByIdAndUpdate(
        id,
        { $set: subjectData },
        { new: true }
      )
      .populate('teachers', 'name')
      .lean();

      if (!updatedSubject) return null;
      return SubjectEntity.create({
        id: updatedSubject._id.toString(),
        subjectName: updatedSubject.subjectName,
        teachers: updatedSubject.teachers,
        notes: updatedSubject.notes,
      });
    } catch (error) {
      throw new Error(`Failed to update subject: ${(error as Error).message}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const deleted = await SubjectModel.findByIdAndDelete(id);
      return !!deleted;
    } catch (error) {
      throw new Error(`Failed to delete subject: ${(error as Error).message}`);
    }
  }
}