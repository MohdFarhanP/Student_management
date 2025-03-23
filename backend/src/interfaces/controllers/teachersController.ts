import { Request, Response } from 'express';
import HttpStatus from '../../utils/httpStatus.js';
import { GetTeachersByLimitUseCase } from '../../application/useCases/teacher/getTeachersByLimitUseCase.js';
import { GetAllTeachersUseCase } from '../../application/useCases/teacher/getAllTeachersUseCase.js';

export class TeacherController {
  constructor(
    private getTeachersByLimitUseCase: GetTeachersByLimitUseCase,
    private getAllTeachersUseCase: GetAllTeachersUseCase
  ) {}
  async getTeachers(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const { data: teachers, totalCount } =
        await this.getTeachersByLimitUseCase.execute(page, limit);
      if (totalCount === 0) {
        res.status(HttpStatus.NOT_FOUND).json({ message: 'No teachers found' });
        return;
      }
      res.status(HttpStatus.OK).json({ teachers, totalCount });
      return;
    } catch (error) {
      console.error('Error fetching teachers :', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal Server Error' });
      return;
    }
  }
  async getAllTeachers(req: Request, res: Response) {
    try {
      const { data: teachers } = await this.getAllTeachersUseCase.execute();

      res.status(HttpStatus.OK).json({ teachers });
      return;
    } catch (error) {
      console.error('Error fetching teachers :', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal Server Error' });
      return;
    }
  }
}
