import { SubjectEntity } from '../../../domain/entities/subject';
import { ISubject } from '../../../domain/interface/ISubject';
import { SubjectModel } from '../../database/models/subjectModel';
import { Types } from 'mongoose';

export class SubjectRepository {
  // async findAllSubjects(): Promise<SubjectEntity[]> {
  //   try {
  //     const subjects = await SubjectModel.find();
  //     return subjects.map((s) =>
  //       SubjectEntity.create(s.id, s.subjectName, s.teachers, s.notes)
  //     );
  //   } catch (error) {
  //     console.error('Error fetching subjects:', error);
  //     throw new Error('Failed to fetch subjects');
  //   }
  // }

  // async findById(id: string): Promise<SubjectEntity | null> {
  //   try {
  //     const subject = await SubjectModel.findById(id);
  //     if (!subject) return null;
  //     return SubjectEntity.create(
  //       subject.id,
  //       subject.subjectName,
  //       subject.teachers,
  //       subject.notes
  //     );
  //   } catch (error) {
  //     console.error('Error finding subject by ID:', error);
  //     throw new Error('Failed to retrieve subject');
  //   }
  // }

  async create(subjectData: SubjectEntity): Promise<ISubject> {
    try {
      const subject = await SubjectModel.create(subjectData);
      return subject;
    } catch (error) {
      console.error('Error creating subject:', error);
      throw new Error('Failed to create subject');
    }
  }
  async findByName(subjectName: string): Promise<SubjectEntity | null> {
    return await SubjectModel.findOne({ subjectName });
  }
  async findByIds(subjectIds: Types.ObjectId[]) {
    return await SubjectModel.find({
      _id: { $in: subjectIds.map((id) => id) },
    });
  }

  async update(
    id: string,
    subjectData: Partial<SubjectEntity>
  ): Promise<ISubject | null> {
    try {
      const result = await SubjectModel.findByIdAndUpdate(
        id,
        { $set: subjectData },
        { new: true }
      );
      return result;
    } catch (error) {
      console.error('Error updating subject:', error);
      throw new Error('Failed to update subject');
    }
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await SubjectModel.findByIdAndDelete(id);
    return !!deleted;
  }
}
