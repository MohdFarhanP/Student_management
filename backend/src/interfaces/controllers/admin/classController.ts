import { Response, Request } from 'express';
import { ClassRepository } from '../../../infrastructure/repositories/admin/classRepository.js';
import HttpStatus from '../../../utils/httpStatus.js';
import { GetClassesUseCase } from '../../../application/useCases/admin/class/getAllClasses.js';
import { UpdateClassUseCase } from '../../../application/useCases/admin/class/updateUseCase.js';
import { GetClassNameUseCase } from '../../../application/useCases/admin/class/getClassNames.js';
import { CreateClassUseCase } from '../../../application/useCases/admin/class/createClassUseCase.js';
import { FetchClassUseCase } from '../../../application/useCases/admin/class/fetchClassUseCase.js';

const classRepository = new ClassRepository();
const createClassUseCase = new CreateClassUseCase(classRepository);
const fetchClassUseCase = new FetchClassUseCase(classRepository);
const getAllClassesUseCase = new GetClassesUseCase(classRepository);
const updateClassUseCase = new UpdateClassUseCase(classRepository);
const getAllClassNamesUseCase = new GetClassNameUseCase(classRepository);

export class ClassController {
  static async addClasses(req: Request, res: Response) {
    try {
      const msg = await createClassUseCase.execute(req.body);
      res.status(HttpStatus.CREATED).json({ message: msg });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      }
    }
  }
  static async getClasses(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 5;
      const { data: classes, totalCount } = await getAllClassesUseCase.execute(
        page,
        limit
      );
      res.status(HttpStatus.OK).json({ classes, totalCount });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      }
    }
  }
  static async updateClass(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedMsg = await updateClassUseCase.execute(id, req.body);
      res.status(HttpStatus.OK).json({ message: updatedMsg });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      }
    }
  }
  static async getAllClassNames(req: Request, res: Response) {
    try {
      const classes = await getAllClassNamesUseCase.execute();
      res.status(HttpStatus.OK).json(classes);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      }
    }
  }
  static async fetchClasses(req: Request, res: Response) {
    try {
      const classes = await fetchClassUseCase.execute();
      res.status(HttpStatus.OK).json(classes);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      }
    }
  }
}
