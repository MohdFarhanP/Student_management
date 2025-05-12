import { ILeaveRepository } from '../../domain/interface/ILeaveRepository';
import { LeaveStatus } from '../../domain/types/enums';
import { Leave } from '../../domain/types/interfaces';
import { LeaveModel } from '../database/models/leaveModel';
    

export class LeaveRepository implements ILeaveRepository {
  async create(leave: Omit<Leave, 'id' | 'createdAt' | 'updatedAt'>): Promise<Leave> {
    const newLeave = await LeaveModel.create(leave);
    return {
      id: newLeave._id.toString(),
      ...newLeave.toObject(),
    };
  }

  async findByStudentId(studentId: string): Promise<Leave[]> {
    const query = studentId ? { studentId } : { status: LeaveStatus.Pending };
    const leaves = await LeaveModel.find(query).exec();
    return await leaves.map((leave) => ({
      id: leave._id.toString(),
      ...leave.toObject(),
    }));
  }

  async findById(id: string): Promise<Leave | null> {
    const leave = await LeaveModel.findById(id).exec();
    if (!leave) return null;
    return {
      id: leave._id.toString(),
      ...leave.toObject(),
    };
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
    return {
      id: updatedLeave._id.toString(),
      ...updatedLeave.toObject(),
    };
  }
}