import { SubjectEntity } from '../../../domain/entities/subject';
import { SubjectModel } from '../../database/mongoos/models/subjectModel';
import { Types } from 'mongoose';
import { ISubjectRepository } from '../../../domain/repositories/ISubjectRepository';
import { mapSubjectName } from '../../database/mongoos/helpers/enumMappers';
import { mapToSubjectEntity } from '../../database/mongoos/helpers/subjectMapper';

export class SubjectRepository implements ISubjectRepository {
  async create(subjectData: SubjectEntity): Promise<SubjectEntity> {
    try {
      const subject = await SubjectModel.create(subjectData);
      const populatedSubject = await subject.populate('teachers', 'name');
      return mapToSubjectEntity(populatedSubject);
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
      return mapToSubjectEntity(subject);
    } catch (error) {
      throw new Error(
        `Failed to find subject by name: ${(error as Error).message}`
      );
    }
  }

  async findByIds(subjectIds: Types.ObjectId[]): Promise<SubjectEntity[]> {
    try {
      const subjects = await SubjectModel.find({
        _id: { $in: subjectIds },
      })
        .populate('teachers', 'name')
        .lean();
      return subjects.map((subject) => mapToSubjectEntity(subject));
    } catch (error) {
      throw new Error(
        `Failed to find subjects by IDs: ${(error as Error).message}`
      );
    }
  }

  async update(
    id: string,
    subjectData: Partial<SubjectEntity>
  ): Promise<SubjectEntity | null> {
    try {
      const updatedSubject = await SubjectModel.findByIdAndUpdate(
        id,
        { $set: subjectData },
        { new: true }
      )
        .populate('teachers', 'name')
        .lean();

      if (!updatedSubject) return null;
      return mapToSubjectEntity(updatedSubject);
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
