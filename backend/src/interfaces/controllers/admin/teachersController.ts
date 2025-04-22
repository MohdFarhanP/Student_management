import { Request, Response } from 'express';
import HttpStatus from '../../../utils/httpStatus';
import { GetTeachersByLimitUseCase } from '../../../application/useCases/admin/teacher/getTeachersByLimitUseCase';
import { GetAllTeachersUseCase } from '../../../application/useCases/admin/teacher/getAllTeachersUseCase';
import { ITeacher } from '../../../domain/interface/ITeacher';
import { AddTeacherUseCase } from '../../../application/useCases/admin/teacher/addTeacherUseCase';
import { DeleteTeacherUseCase } from '../../../application/useCases/admin/teacher/deleteTeacherUseCase';
import { EditTeacherUseCase } from '../../../application/useCases/admin/teacher/editTeacherUseCase';

export class TeacherController {
  constructor(
    private getTeachersByLimitUseCase: GetTeachersByLimitUseCase,
    private editTeacherUseCase: EditTeacherUseCase,
    private getAllTeachersUseCase: GetAllTeachersUseCase,
    private addTeacherUseCase: AddTeacherUseCase,
    private deleteTeacherUseCase: DeleteTeacherUseCase
  ) {}

  async getTeachers(req: Request, res: Response): Promise<void> {
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
    } catch (error) {
      console.error('Error fetching teachers:', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal Server Error' });
    }
  }
  async getAllTeachers(req: Request, res: Response): Promise<void> {
    try {
      const { data: teachers } = await this.getAllTeachersUseCase.execute();
      res.status(HttpStatus.OK).json({ teachers });
    } catch (error) {
      console.error('Error fetching teachers:', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal Server Error' });
    }
  }
  async editTeacher(req: Request, res: Response): Promise<void> {
    try {
      const { teacherId } = req.params;
      const teacherData: Partial<ITeacher> = req.body;

      const updatedTeacher = await this.editTeacherUseCase.execute(
        teacherId,
        teacherData
      );
      res.status(HttpStatus.OK).json({
        message: 'Teacher updated successfully',
        data: updatedTeacher,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({ message });
    }
  }
  async addTeacher(req: Request, res: Response): Promise<void> {
    try {
      const teacherData: Partial<ITeacher> = req.body;
      const newTeacher = await this.addTeacherUseCase.execute(teacherData);
      res.status(HttpStatus.CREATED).json({
        message: 'Teacher added successfully',
        data: newTeacher,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({ message });
    }
  }
  async deleteTeacher(req: Request, res: Response): Promise<void> {
    try {
      const { teacherId } = req.params;
      console.log("hitting the controller")
      await this.deleteTeacherUseCase.execute(teacherId);
      res.status(HttpStatus.OK).json({
        message: 'Teacher deleted successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_REQUEST).json({ message });
    }
  }
}
