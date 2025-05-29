import { Leave } from '../../../../domain/types/interfaces';
import { mapLeaveStatus } from './enumMappers';

export function mapToLeaveEntity(leaveDoc: any): Leave {
  return {
    id: leaveDoc._id.toString(),
    studentId: leaveDoc.studentId,
    date: leaveDoc.date,
    reason: leaveDoc.reason,
    status: mapLeaveStatus(leaveDoc.status),
    createdAt: leaveDoc.createdAt,
    updatedAt: leaveDoc.updatedAt,
  };
}
