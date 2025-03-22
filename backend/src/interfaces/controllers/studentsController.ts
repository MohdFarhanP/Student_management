import { Request, Response } from 'express';
import HttpStatus from '../../utils/httpStatus.js';
import { GetAllStudentsUseCase } from '../../application/useCases/student/betAllStudentsUseCase.js';

export class StudentController {
  constructor(private getAllStudentsUseCase: GetAllStudentsUseCase) {}

  async getStudents(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const { data: students, totalCount } =
        await this.getAllStudentsUseCase.execute(page, limit);
      if (totalCount === 0) {
        res.status(HttpStatus.NOT_FOUND).json({ message: 'No students found' });
        return;
      }
      res.status(HttpStatus.OK).json({ students, totalCount });
      return;
    } catch (error) {
      console.error('Error fetching students:', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal Server Error' });
      return;
    }
  }
}
