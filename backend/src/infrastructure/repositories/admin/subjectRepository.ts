import { SubjectEntity } from '../../../domain/entities/subject';
import { SubjectModel } from '../../database/models/subjectModel';
import { Types } from 'mongoose';
import { ISubjectRepository } from '../../../domain/interface/ISubjectRepository';

export class SubjectRepository implements ISubjectRepository {
  async create(subjectData: SubjectEntity): Promise<SubjectEntity> {
    try {
      const subject = await SubjectModel.create(subjectData);
      return SubjectEntity.create({
        id: subject._id.toString(),
        subjectName: subject.subjectName,
        teachers: subject.teachers,
        notes: subject.notes,
      });
    } catch (error) {
      throw new Error(`Failed to create subject: ${(error as Error).message}`);
    }
  }

  async findByName(subjectName: string): Promise<SubjectEntity | null> {
    try {
      const subject = await SubjectModel.findOne({ subjectName }).lean();
      if (!subject) return null;
      return SubjectEntity.create({
        id: subject._id.toString(),
        subjectName: subject.subjectName,
        teachers: subject.teachers,
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
      }).lean();
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
      ).lean();
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