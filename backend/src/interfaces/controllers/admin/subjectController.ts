import { Request, Response } from 'express';
import { ClassRepository } from '../../../infrastructure/repositories/admin/classRepository.js';
import { SubjectRepository } from '../../../infrastructure/repositories/admin/subjectRepository.js';
import { CreateSubjectUseCase } from '../../../application/useCases/admin/subject/CreateSubjectUseCase.js';
import HttpStatus from '../../../utils/httpStatus.js';
import { GetSubjectsByClassUseCase } from '../../../application/useCases/admin/subject/GetSubjectUseCase.js';
import { FetchSubjectsByClassIdUseCase } from '../../../application/useCases/admin/subject/FetchSubjectsByClassIdUseCase.js';

const classRepository = new ClassRepository();
const subjectRepository = new SubjectRepository();

const createSubjectUseCase = new CreateSubjectUseCase(
  subjectRepository,
  classRepository
);
const fetchSubjectsByClassIdUseCase = new FetchSubjectsByClassIdUseCase(
  subjectRepository,
  classRepository
);
const getSubjectsByClass = new GetSubjectsByClassUseCase(
  subjectRepository,
  classRepository
);

export class SubjectController {
  static async createSubject(req: Request, res: Response) {
    try {
      const { grade } = req.params;
      const { subjectName, teachers, notes } = req.body;

      const subjectData = {
        subjectName,
        teachers,
        notes,
      };

      const newSubject = await createSubjectUseCase.execute(grade, subjectData);
      res.status(HttpStatus.CREATED).json({ data: newSubject });
      return;
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      }
      return;
    }
  }
  static async getClassSubjects(req: Request, res: Response) {
    try {
      const { grade } = req.params;
      const subjects = await getSubjectsByClass.execute(grade);
      res.status(200).json(subjects);
      return;
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
      return;
    }
  }
  static async fetchSubjectsByClassId(req: Request, res: Response) {
    try {
      const { classId } = req.params;
      const subjects = await fetchSubjectsByClassIdUseCase.execute(classId);
      res.status(200).json(subjects);
      return;
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
      return;
    }
  }
  static async deleteSubject (req:Request, res: Response) {
    try {
      const { classId, subjectId } = req.params;
      await this.deleteSubjectByidsUseCase.execute()
    } catch (error) {
      
    }
  }
}
