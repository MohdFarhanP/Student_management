import { Response, Request } from 'express';
import HttpStatus from '../../../utils/httpStatus';
import { GetClassesUseCase } from '../../../application/useCases/admin/class/getAllClasses';
import { UpdateClassUseCase } from '../../../application/useCases/admin/class/updateUseCase';
import { GetClassNameUseCase } from '../../../application/useCases/admin/class/getClassNames';
import { CreateClassUseCase } from '../../../application/useCases/admin/class/createClassUseCase';
import { FetchClassUseCase } from '../../../application/useCases/admin/class/fetchClassUseCase';
import { GetStudentsByClassUseCase } from '../../../application/useCases/admin/class/getStudentsByClass';

export class ClassController {
  constructor(
    private createClassUseCase: CreateClassUseCase,
    private fetchClassUseCase: FetchClassUseCase,
    private getAllClassesUseCase: GetClassesUseCase,
    private updateClassUseCase: UpdateClassUseCase,
    private getAllClassNamesUseCase: GetClassNameUseCase,
    private getStudentsByClassUseCase: GetStudentsByClassUseCase
  ) {}
  async addClasses(req: Request, res: Response) {
    try {
      const msg = await this.createClassUseCase.execute(req.body);
      res.status(HttpStatus.CREATED).json({ message: msg });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      }
    }
  }
  async getClasses(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 5;
      const { data: classes, totalCount } =
        await this.getAllClassesUseCase.execute(page, limit);
      res.status(HttpStatus.OK).json({ classes, totalCount });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      }
    }
  }
  async updateClass(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedMsg = await this.updateClassUseCase.execute(id, req.body);
      res.status(HttpStatus.OK).json({ message: updatedMsg });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      }
    }
  }
  async getAllClassNames(req: Request, res: Response) {
    try {
      const classes = await this.getAllClassNamesUseCase.execute();
      res.status(HttpStatus.OK).json(classes);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      }
    }
  }
  async fetchClasses(req: Request, res: Response) {
    try {
      const classes = await this.fetchClassUseCase.execute();
      res.status(HttpStatus.OK).json(classes);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      }
    }
  }
  async getStudentByClass(req: Request, res: Response): Promise<void> {
    try {
      const { classId } = req.params;
      const students = await this.getStudentsByClassUseCase.execute(classId);
      res.status(200).json(students);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({ message });
    }
  }
}
