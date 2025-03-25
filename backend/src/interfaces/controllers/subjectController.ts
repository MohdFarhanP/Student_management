import { Request, Response } from 'express';
import { ClassRepository } from '../../infrastructure/repositories/classRepository.js';
import { SubjectRepository } from '../../infrastructure/repositories/subjectRepository.js';
import { CreateSubjectUseCase } from '../../application/useCases/subject/createSubjectUseCase.js';
import HttpStatus from '../../utils/httpStatus.js';
import { GetSubjectsByClassUseCase } from '../../application/useCases/subject/getSubjectUseCase.js';
import { FetchSubjectsByClassIdUseCase } from '../../application/useCases/subject/fetchSubjectsByClassIdUseCase.js';

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

      const createdMsg = await createSubjectUseCase.execute(grade, subjectData);
      res.status(HttpStatus.CREATED).json({ message: createdMsg });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      }
    }
  }
  static async getClassSubjects(req: Request, res: Response) {
    try {
      const { grade } = req.params;
      const subjects = await getSubjectsByClass.execute(grade);
      res.status(200).json(subjects);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }
  static async fetchSubjectsByClassId(req: Request, res: Response) {
    try {
      const { classId } = req.params;
      const subjects = await fetchSubjectsByClassIdUseCase.execute(classId);
      res.status(200).json(subjects);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }
}
