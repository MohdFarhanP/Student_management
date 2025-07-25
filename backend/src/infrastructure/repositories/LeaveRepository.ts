import { ILeaveRepository } from '../../domain/repositories/ILeaveRepository';
import { LeaveStatus } from '../../domain/types/enums';
import { Leave } from '../../domain/types/interfaces';
import { mapToLeaveEntity } from '../database/mongoos/helpers/leaveMapper';
import { LeaveModel } from '../database/mongoos/models/leaveModel';

export class LeaveRepository implements ILeaveRepository {
  async create(
    leave: Omit<Leave, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Leave> {
    const newLeave = await LeaveModel.create(leave);
    return mapToLeaveEntity(newLeave);
  }

  async findByStudentId(studentId: string): Promise<Leave[]> {
    const query = studentId ? { studentId } : { status: LeaveStatus.Pending };
    const leaves = await LeaveModel.find(query).exec();
    return leaves.map((leave) => mapToLeaveEntity(leave));
  }

  async findById(id: string): Promise<Leave | null> {
    const leave = await LeaveModel.findById(id).exec();
    if (!leave) return null;
    return mapToLeaveEntity(leave);
  }

  async update(id: string, data: Partial<Leave>): Promise<Leave> {
    const updatedLeave = await LeaveModel.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date().toISOString() },
      { new: true }
    ).exec();
    if (!updatedLeave) {
      throw new Error('Leave not found');
    }
    return mapToLeaveEntity(updatedLeave);
  }
}
